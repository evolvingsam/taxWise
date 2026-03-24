from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse

from .serializers import (
    IntakeInputSerializer,
    IntakeSuccessResponseSerializer,
    IntakePartialResponseSerializer,
    IntakeErrorResponseSerializer,
)
from .validators import RawIntakePayload
from ..pipeline.orchestrator import IntakePipelineOrchestrator
from ..utils.logging import get_logger

logger = get_logger(__name__)


class SmartIntakeView(APIView):
    """
    Accepts plain-English financial text, parses it with AI,
    and saves a structured ledger entry ready for the Tax Engine.
    """

    @extend_schema(
        tags=["Smart Intake"],
        summary="Submit a financial intake",
        description=(
            "Accepts raw financial text from the user. "
            "The AI layer extracts income, expenses, user type, and period. "
            "The result is saved as a pending ledger entry for the Tax Engine to process."
        ),
        request=IntakeInputSerializer,
        responses={
            201: OpenApiResponse(
                response=IntakeSuccessResponseSerializer,
                description="Intake parsed and ledger entry created. Status is 'pending'.",
            ),
            207: OpenApiResponse(
                response=IntakePartialResponseSerializer,
                description="AI parsed successfully but DB write failed. Parsed data still returned.",
            ),
            400: OpenApiResponse(
                response=IntakeErrorResponseSerializer,
                description="Request body failed validation.",
            ),
            422: OpenApiResponse(
                response=IntakeErrorResponseSerializer,
                description="Business rule validation failed.",
            ),
            503: OpenApiResponse(
                response=IntakeErrorResponseSerializer,
                description="AI service is unavailable.",
            ),
        },
        examples=[
            OpenApiExample(
                name="Market trader — weekly profit",
                request_only=True,
                value={
                    "user_id": "usr_abc123",
                    "raw_text": (
                        "I run a shop. I spent ₦150,000 on rent "
                        "and my profit this week was ₦40,200."
                    ),
                    "source": "web",
                },
            ),
            OpenApiExample(
                name="Corporate employee — monthly salary",
                request_only=True,
                value={
                    "user_id": "usr_xyz789",
                    "raw_text": (
                        "I earn ₦850,000 monthly as a software engineer. "
                        "I pay ₦50,000 for transport and ₦30,000 for data."
                    ),
                    "source": "web",
                },
            ),
            OpenApiExample(
                name="Successful intake",
                response_only=True,
                status_codes=["201"],
                value={
                    "status": "success",
                    "ledger_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                    "intake_status": "pending",
                    "parsed": {
                        "income": 40200.0,
                        "expenses": {"rent": 150000.0},
                        "user_type": "individual",
                        "period": "weekly",
                        "confidence": 0.94,
                    },
                },
            ),
        ],
    )
    def post(self, request):
        serializer = IntakeInputSerializer(data=request.data)

        if not serializer.is_valid():
            logger.warning("Invalid intake payload: %s", serializer.errors)
            return Response(
                {"status": "error", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload = RawIntakePayload(**serializer.validated_data)

        try:
            payload.validate()
        except ValueError as e:
            logger.warning("Business validation failed: %s", str(e))
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        orchestrator = IntakePipelineOrchestrator()
        result = orchestrator.run(payload)

        if result.success:
            return Response(result.to_dict(), status=status.HTTP_201_CREATED)

        if result.error and "unavailable" in result.error.lower():
            return Response(
                {"status": "error", "message": result.error},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            {"status": "partial_failure", "message": result.error, "parsed": result.parsed},
            status=status.HTTP_207_MULTI_STATUS,
        )