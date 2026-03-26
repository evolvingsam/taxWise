from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse

from .serializers import (
    InitiatePaymentSerializer,
    WebhookPayloadSerializer,
    PaymentSuccessResponseSerializer,
    PaymentErrorResponseSerializer,
    InitiatePaymentResponseSerializer,
)
from ..pipeline.orchestrator import PaymentOrchestrator
from ..utils.logging import get_logger

logger = get_logger(__name__)


class InitiatePaymentView(APIView):
    """
    Called by the frontend BEFORE opening the Interswitch modal.
    Creates a pending transaction record so the webhook has something to update.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["Payments"],
        summary="Initiate a payment transaction",
        description=(
            "Creates a pending PaymentTransaction record. "
            "Must be called before the Interswitch WebPay modal is opened. "
            "User identity is taken from the JWT token."
        ),
        request=InitiatePaymentSerializer,
        responses={
            201: OpenApiResponse(
                response=InitiatePaymentResponseSerializer,
                description="Transaction record created. Frontend can now open Interswitch modal.",
            ),
            400: OpenApiResponse(
                response=PaymentErrorResponseSerializer,
                description="Invalid request payload.",
            ),
            401: OpenApiResponse(
                description="Authentication credentials were not provided.",
            ),
            500: OpenApiResponse(
                response=PaymentErrorResponseSerializer,
                description="Internal server error.",
            ),
        },
        examples=[
            OpenApiExample(
                name="Initiate filing fee payment",
                request_only=True,
                value={
                    "tx_ref":   "TAXEASE-usr_abc123-1711234567",
                    "amount":   1000.00,
                    "tax_year": 2026,
                },
            ),
        ],
    )
    def post(self, request):
        serializer = InitiatePaymentSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"status": "error", "message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data         = serializer.validated_data
        orchestrator = PaymentOrchestrator()

        try:
            orchestrator.initiate_transaction(
                user_id  = request.user.id,    # ← from JWT, not request body
                tx_ref   = data["tx_ref"],
                amount   = data["amount"],
                tax_year = data["tax_year"],
            )
        except Exception as e:
            logger.error("Transaction initiation failed: %s", str(e), exc_info=True)
            return Response(
                {"status": "error", "message": "Could not initiate transaction."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {
                "status":  "success",
                "message": "Transaction initiated. Proceed to payment.",
                "tx_ref":  data["tx_ref"],
            },
            status=status.HTTP_201_CREATED,
        )


class InterswitchWebhookView(APIView):
    """
    Receives Interswitch's silent POST callback after payment.
    Verifies the signature, generates the RRR, and updates the DB.
    No authentication required — Interswitch cannot send a Bearer token.
    """
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        tags=["Payments"],
        summary="Interswitch payment webhook",
        description=(
            "Receives the silent callback from Interswitch after a payment attempt. "
            "Verifies the SHA-512 signature, generates the government RRR code on success, "
            "and upgrades the user's WAEC grade to A."
        ),
        request=WebhookPayloadSerializer,
        responses={
            200: OpenApiResponse(
                response=PaymentSuccessResponseSerializer,
                description="Payment verified and RRR generated.",
            ),
            400: OpenApiResponse(
                response=PaymentErrorResponseSerializer,
                description="Invalid payload or failed signature verification.",
            ),
        },
        examples=[
            OpenApiExample(
                name="Successful Interswitch webhook",
                request_only=True,
                value={
                    "txnref": "TAXEASE-usr_abc123-1711234567",
                    "amount": "100000",
                    "resp":   "00",
                    "hash":   "a3f9...sha512hash...c82b",
                },
            ),
            OpenApiExample(
                name="RRR generated successfully",
                response_only=True,
                status_codes=["200"],
                value={
                    "status":   "success",
                    "rrr_code": "NRS-4829-1102",
                    "message":  "Payment confirmed! Use NRS-4829-1102 to complete your tax remittance via your bank app.",
                },
            ),
        ],
    )
    def post(self, request):
        serializer = WebhookPayloadSerializer(data=request.data)

        if not serializer.is_valid():
            logger.warning("Invalid webhook payload: %s", serializer.errors)
            return Response(
                {"status": "error", "message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        orchestrator = PaymentOrchestrator()
        result       = orchestrator.handle_webhook(serializer.validated_data)

        if result.success:
            return Response(result.to_dict(), status=status.HTTP_200_OK)

        return Response(result.to_dict(), status=status.HTTP_400_BAD_REQUEST)