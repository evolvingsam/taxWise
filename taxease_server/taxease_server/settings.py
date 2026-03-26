from pathlib import Path
from decouple import config, Csv
from datetime import timedelta
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = config("SECRET_KEY")
DEBUG      = config("DEBUG", default=False, cast=bool)
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="localhost", cast=Csv())


# ── Application Definition ─────────────────────────────────────────────────────


INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework_simplejwt.token_blacklist",


    # Third party
    "rest_framework",
    "drf_spectacular",
    'corsheaders',  

    # Local apps
    "apps.smart_intake",
    "apps.tax_engine",
    "apps.payments",
    "apps.accounts",
    
]


# ── Middleware ─────────────────────────────────────────────────────────────────
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    'corsheaders.middleware.CorsMiddleware',
]


# ── URLs & WSGI ────────────────────────────────────────────────────────────────
ROOT_URLCONF = "taxease_server.urls"        
WSGI_APPLICATION = "taxease_server.wsgi.application"


# ── Templates ─────────────────────────────────────────────────────────────────
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# ── Database ───────────────────────────────────────────────────────────────────
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

DATABASES["default"] = dj_database_url.parse(config("DATABASE_URL"))


# ── Password Validators ────────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ── Internationalisation ───────────────────────────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE     = "Africa/Lagos"
USE_I18N      = True
USE_TZ        = True


# ── Static Files ───────────────────────────────────────────────────────────────
STATIC_URL  = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

AUTH_USER_MODEL = "accounts.User"

# ── Default Primary Key ────────────────────────────────────────────────────────
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME":  timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS":  True,
    "BLACKLIST_AFTER_ROTATION": True,
}

# ── Django REST Framework ──────────────────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",  # locked by default
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
    ],
}


# ── drf-spectacular (Swagger) ──────────────────────────────────────────────────
SPECTACULAR_SETTINGS = {
    "TITLE":       "TaxEase API",
    "DESCRIPTION": "AI-powered Nigerian tax filing platform",
    "VERSION":     "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "TAGS": [
        {"name": "Smart Intake", "description": "AI-driven financial text intake"},
    ],
}


# ── Gemini ────────────────────────────────────────────────────────────────────
GEMINI_API_KEY = config("GEMINI_API_KEY")
GEMINI_MODEL   = config("GEMINI_MODEL", default="gemini-1.5-flash")

# ── OpenAI ────────────────────────────────────────────────────────────────────
OPENAI_API_KEY = config("OPENAI_API_KEY")
OPENAI_MODEL   = config("OPENAI_MODEL", default="gpt-4o-mini")



# ── Logging ───────────────────────────────────────────────────────────────────
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "[{asctime}] {levelname} [{name}]: {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "DEBUG" if DEBUG else "INFO",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "apps.smart_intake": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
        "apps.tax_engine": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
        "apps.payments": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}