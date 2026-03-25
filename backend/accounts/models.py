from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .managers import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    INDIVIDUAL = 'individual'
    SME = 'sme'
    CORPORATE = 'corporate'

    USER_TYPE_CHOICES = (
        (INDIVIDUAL, 'Individual'),
        (SME, 'SME'),
        (CORPORATE, 'Corporate'),
    )

    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=150)
    last_name = models.CharField(_('last name'), max_length=150)
    user_type = models.CharField(
        _('user type'),
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default=INDIVIDUAL
    )
    
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = _('user')
        verbose_name = _('users')

    def __str__(self):
        return self.email

    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
