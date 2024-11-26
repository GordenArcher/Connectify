from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register, name="register"),
    path("", views.login, name="login"),
    path("user/logout/", views.logout, name="logout"),
    path("profile/@<str:username>/", views.profile, name="profile"),
    path("profile/@<str:username>/edit/", views.edit_profile, name="edit_profile")
]
