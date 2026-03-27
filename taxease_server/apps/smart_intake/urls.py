from django.urls import path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from .intake.views import SmartIntakeView, LedgerHistoryView, LedgerDetailView

urlpatterns = [
    # Core intake
    path("",                       SmartIntakeView.as_view(),   name="smart-intake"),

    # Ledger history
    path("ledger/",                LedgerHistoryView.as_view(), name="ledger-history"),
    path("ledger/<uuid:entry_id>/", LedgerDetailView.as_view(), name="ledger-detail"),

    # Docs
    path("schema/", SpectacularAPIView.as_view(),   name="smart-intake-schema"),
    path("docs/",   SpectacularSwaggerView.as_view(url_name="smart-intake-schema"), name="smart-intake-swagger"),
    path("redoc/",  SpectacularRedocView.as_view(url_name="smart-intake-schema"),   name="smart-intake-redoc"),
]