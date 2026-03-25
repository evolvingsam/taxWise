from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from .serializers import TaxCalculationResponseSerializer, TaxErrorResponseSerializer
from ..pipeline.orchestrator import TaxEngineOrchestrator
from ..utils.logging import get_logger

logger = get_logger(__name__)


class TaxCalculateView(APIView):
    """
    Triggers the full tax calculation pipeline for a user.
    Pulls all pending ledger entries, applies 2026 tax rules,
    grades compliance, and returns a full breakdown.
    """

    @extend_schema(
        tags=["Tax Engine"],
        summary="Calculate tax for a user",
        description=(
            "Triggers the full 2026 Nigerian tax calculation pipeline. "
            "Assembles all pending ledger entries, applies exemption filters, "
            "deductions, progressive brackets, and returns a WAEC compliance grade."
        ),
        parameters=[
            OpenApiParameter(
                name="user_id",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=True,
                description="The unique identifier of the user.",
            )
        ],
        responses={
            200: OpenApiResponse(
                response=TaxCalculationResponseSerializer,
                description="Tax calculation completed successfully.",
            ),
            400: OpenApiResponse(
                response=TaxErrorResponseSerializer,
                description="Missing or invalid user_id.",
            ),
            500: OpenApiResponse(
                response=TaxErrorResponseSerializer,
                description="Internal engine failure.",
            ),
        },
        examples=[
            OpenApiExample(
                name="Taxable individual result",
                response_only=True,
                status_codes=["200"],
                value={
                    "status": "success",
                    "breakdown": {
                        "gross_income":        4500000,
                        "deductions_applied":  500000,
                        "taxable_income":      4000000,
                        "final_tax_owed":      45000,
                        "platform_filing_fee": 1000,
                    },
                    "tax_waec_result": "A",
                    "message": "Your WAEC compliance grade is A. Pay ₦45,000 in tax plus the ₦1,000 filing fee.",
                },
            ),
            OpenApiExample(
                name="Exempt individual result",
                response_only=True,
                status_codes=["200"],
                value={
                    "status": "exempt",
                    "breakdown": {
                        "gross_income":        600000,
                        "deductions_applied":  0,
                        "taxable_income":      0,
                        "final_tax_owed":      0,
                        "platform_filing_fee": 1000,
                    },
                    "tax_waec_result": "B",
                    "message": "Income is below the ₦800,000 threshold. Pay ₦1,000 to get your Zero-Tax Certificate.",
                },
            ),
        ],
    )
    def get(self, request):
        user_id = request.query_params.get("user_id")

        if not user_id:
            return Response(
                {"status": "error", "message": "user_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        logger.info("Tax calculation requested. user_id=%s", user_id)

        orchestrator = TaxEngineOrchestrator()
        engine_result = orchestrator.run(user_id)

        if engine_result.success:
            return Response(
                engine_result.to_response_dict(),
                status=status.HTTP_200_OK,
            )

        return Response(
            {"status": "error", "message": engine_result.error},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )