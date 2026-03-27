from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from .serializers import (
    IntakeInputSerializer,
    IntakeSuccessResponseSerializer,
    IntakePartialResponseSerializer,
    IntakeErrorResponseSerializer,
    LedgerHistoryResponseSerializer,
    LedgerDetailResponseSerializer,
    LedgerEntrySerializer,
)
from .validators import RawIntakePayload
from ..pipeline.orchestrator import IntakePipelineOrchestrator
from ..persistence.repository import IntakeRepository
from ..utils.logging import get_logger

logger = get_logger(__name__)


class SmartIntakeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["Smart Intake"],
        summary="Submit a financial intake",
        description=(
            "Accepts plain-English financial text. "
            "User identity is taken from the JWT token. "
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
                    "source":   "web",
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


class LedgerHistoryView(APIView):
    """
    Returns the full ledger history for the authenticated user.
    Each entry represents one AI-parsed financial intake submission.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["Smart Intake"],
        summary="Get ledger history",
        description=(
            "Returns all financial intake entries for the authenticated user, "
            "newest first. Each entry shows the parsed income, expenses, period, "
            "AI confidence score, and processing status."
        ),
        responses={
            200: OpenApiResponse(
                response=LedgerHistoryResponseSerializer,
                description="Ledger history returned successfully.",
            ),
            401: OpenApiResponse(
                description="Authentication credentials were not provided.",
            ),
        },
        examples=[
            OpenApiExample(
                name="Ledger history response",
                response_only=True,
                status_codes=["200"],
                value={
                    "status": "success",
                    "count":  2,
                    "results": [
                        {
                            "id":            "a1b2c3d4-...",
                            "user_type":     "individual",
                            "income":        "40200.00",
                            "expenses":      {"rent": 15000.0},
                            "period":        "weekly",
                            "ai_confidence": "0.940",
                            "status":        "processed",
                            "raw_text":      "I run a shop. My profit this week was ₦40,200.",
                            "created_at":    "2026-03-24T14:00:00Z",
                            "updated_at":    "2026-03-24T14:01:00Z",
                        },
                    ],
                },
            ),
        ],
    )
    def get(self, request):
        repository = IntakeRepository()
        entries    = repository.get_all_for_user(user_id=request.user.id)

        serializer = LedgerEntrySerializer(entries, many=True)

        return Response(
            {
                "status":  "success",
                "count":   len(entries),
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class LedgerDetailView(APIView):
    """
    Returns a single ledger entry by ID — only if it belongs to the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["Smart Intake"],
        summary="Get a single ledger entry",
        description=(
            "Returns the full detail of a single ledger entry. "
            "Users can only access their own entries."
        ),
        parameters=[
            OpenApiParameter(
                name="entry_id",
                type=OpenApiTypes.UUID,
                location=OpenApiParameter.PATH,
                description="The UUID of the ledger entry.",
            ),
        ],
        responses={
            200: OpenApiResponse(
                response=LedgerDetailResponseSerializer,
                description="Ledger entry returned.",
            ),
            401: OpenApiResponse(
                description="Authentication credentials were not provided.",
            ),
            404: OpenApiResponse(
                description="Entry not found or does not belong to this user.",
            ),
        },
    )
    def get(self, request, entry_id):
        repository = IntakeRepository()
        entry      = repository.get_single_for_user(
            user_id  = request.user.id,
            entry_id = entry_id,
        )

        if not entry:
            return Response(
                {"status": "error", "message": "Ledger entry not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = LedgerEntrySerializer(entry)
        return Response(
            {"status": "success", "data": serializer.data},
            status=status.HTTP_200_OK,
        )