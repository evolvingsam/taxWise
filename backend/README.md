# TaxWise Backend

This is the Django-based backend for the TaxWise application. It features a custom user authentication system based on emails and supports different user types.

## Features

- **JWT Authentication**: Stateless authentication with token blacklisting.
- **Role-based Permissions**: `IsIndividual`, `IsSME`, `IsCorporate`.
- **Environment Config**: Uses `.env` and `django-environ` for security.
- **CORS Support**: Integrated `django-cors-headers`.
- **DRF Implementation**: API endpoints for registration, login, logout (blacklist), and profile (`/me/` with GET/PATCH).

## Project Structure

- `core/`: Project settings, URL routing, and WSGI/ASGI configuration.
- `accounts/`: App handling user models, authentication, and user profiles.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   pip install django djangorestframework djangorestframework-simplejwt django-environ django-cors-headers
   ```

2. **Setup Environment**:
   - Create a `.env` file in the `backend/` directory.
   - Use [.env.example](./.env.example) as a template: `cp .env.example .env`.
   - Update `SECRET_KEY`, `ALLOWED_HOSTS`, and `CORS_ALLOWED_ORIGINS` in your `.env`.

3. **Database Migrations**:
   ```bash
   python manage.py makemigrations accounts
   python manage.py migrate
   ```

4. **Create Superuser (Optional)**:
   ```bash
   python manage.py createsuperuser
   ```

5. **Run Server**:
   ```bash
   python manage.py runserver
   ```

## API Documentation

The detailed API documentation for frontend developers can be found in [frontend_guide.md](./frontend_guide.md).

## Testing

A Postman collection is provided in [postman_collection.json](./postman_collection.json) to facilitate testing of the authentication flow.
