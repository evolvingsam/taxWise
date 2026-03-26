from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

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
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["Smart Intake"],
        summary="Submit a financial intake",
        description=(
            "Accepts plain-English financial text. "
            "User identity is taken from the JWT token — no need to pass user_id. "
            "The AI layer extracts income and expenses, result is saved as a pending ledger entry."
        ),
        request=IntakeInputSerializer,
        responses={
            201: OpenApiResponse(response=IntakeSuccessResponseSerializer),
            207: OpenApiResponse(response=IntakePartialResponseSerializer),
            400: OpenApiResponse(response=IntakeErrorResponseSerializer),
            401: OpenApiResponse(description="Authentication credentials were not provided."),
            422: OpenApiResponse(response=IntakeErrorResponseSerializer),
            503: OpenApiResponse(response=IntakeErrorResponseSerializer),
        },
        examples=[
            OpenApiExample(
                name="Market trader",
                request_only=True,
                value={
                    "raw_text": "I run a shop. My profit this week was ₦40,200 and I paid ₦15,000 rent.",
                    "source": "web",
                },
            ),
        ],
    )
    def post(self, request):
        serializer = IntakeInputSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"status": "error", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ── Pull user_id from JWT, not from request body ───────────────────────
        payload = RawIntakePayload(
            user_id  = str(request.user.id),
            raw_text = serializer.validated_data["raw_text"],
            source   = serializer.validated_data.get("source", "web"),
        )

        try:
            payload.validate()
        except ValueError as e:
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