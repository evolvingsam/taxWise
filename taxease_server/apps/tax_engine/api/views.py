from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse

from .serializers import TaxCalculationResponseSerializer, TaxErrorResponseSerializer
from ..pipeline.orchestrator import TaxEngineOrchestrator
from ..utils.logging import get_logger

logger = get_logger(__name__)


class TaxCalculateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["Tax Engine"],
        summary="Calculate tax for the authenticated user",
        description=(
            "Triggers the full 2026 Nigerian tax calculation pipeline. "
            "User identity and entity type are taken from the JWT token. "
            "No parameters needed — just send your Bearer token."
        ),
        responses={
            200: OpenApiResponse(response=TaxCalculationResponseSerializer),
            401: OpenApiResponse(description="Authentication credentials were not provided."),
            500: OpenApiResponse(response=TaxErrorResponseSerializer),
        },
        examples=[
            OpenApiExample(
                name="Taxable individual",
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
                    "message": "Pay ₦45,000 in tax plus ₦1,000 filing fee.",
                },
            ),
        ],
    )
    def get(self, request):
        user_id     = str(request.user.id)
        entity_type = request.user.user_type   # pulled directly from JWT/User model

        logger.info(
            "Tax calculation requested. user_id=%s entity_type=%s",
            user_id, entity_type,
        )

        orchestrator = TaxEngineOrchestrator()
        engine_result = orchestrator.run(user_id=user_id, entity_type=entity_type)

        if engine_result.success:
            return Response(engine_result.to_response_dict(), status=status.HTTP_200_OK)

        return Response(
            {"status": "error", "message": engine_result.error},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )