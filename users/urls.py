from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register, name="register"),
    path("", views.login, name="login"),
    path("user/logout/", views.logout, name="logout"),
    path("profile/@<str:username>/", views.profile, name="profile"),
    path("profile/@<str:username>/edit/", views.edit_profile, name="edit_profile"),
    path('send-friend-request/<int:user_id>/', views.send_friend_request, name='send_friend_request'),
    path('friend-requests/', views.view_friend_requests, name='friend_requests'),
    path('accept-friend-request/<int:request_id>/', views.accept_friend_request, name='accept_friend_request'),
    path('reject-friend-request/<int:request_id>/', views.reject_friend_request, name='reject_friend_request'),
]
