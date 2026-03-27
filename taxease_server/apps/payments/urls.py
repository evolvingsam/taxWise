from django.urls import path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from .api.views import InitiatePaymentView, InterswitchWebhookView, TransactionStatusView

urlpatterns = [
    path("initiate/",              InitiatePaymentView.as_view(),    name="payment-initiate"),
    path("webhooks/interswitch/",  InterswitchWebhookView.as_view(), name="interswitch-webhook"),
    path("transaction/<str:tx_ref>/", TransactionStatusView.as_view(), name="transaction-status"),
    path("schema/",  SpectacularAPIView.as_view(),   name="payments-schema"),
    path("docs/",    SpectacularSwaggerView.as_view(url_name="payments-schema"), name="payments-swagger"),
    path("redoc/",   SpectacularRedocView.as_view(url_name="payments-schema"),   name="payments-redoc"),
]