from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create, name="create"),
    path("feed/", views.feed, name="feed"),
    path("feed/<int:pk>/view_post/", views.view_feed_post, name="view_post"),
    path('like-post/<int:post_id>/', views.Like_post, name='like_post'),
    path('comment-post/<int:comment_id>/', views.comment_post, name='comment_post'),
]
