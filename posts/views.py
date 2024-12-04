from django.shortcuts import render, get_object_or_404
from .models import Posts, Like, Comment
from users.models import FriendRequest
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json
from django.contrib.auth.models import User
from django.db.models import Exists, OuterRef

def feed(request):
    all_posts = Posts.objects.annotate(
        is_liked_by_user=Exists(
            Like.objects.filter(user=request.user, post=OuterRef('pk'))
        )
    ).order_by("-created_at")
    friend_requests = FriendRequest.objects.filter(to_user=request.user, is_accepted=False)
    users = User.objects.filter()
    context = {
        "allpost": all_posts,
        "friend_requests":friend_requests,
        "users":users
    }

    return render(request, 'posts.html', context)  


def create_txt_post(request):
    if request.method == 'POST':
        user = request.user
        data = json.loads(request.body)
        user_post = data.get("something")

                    
        try:
            if user_post:
                create_post = Posts.objects.create(user=user, text_post=user_post)
                create_post.save()

                return JsonResponse({
                    "status":"sucess",
                    "message":"Post made sucessfull",
                    "payload": {
                        "username":user.username,
                        "profile_picture":user.profile.profile_picture.url,
                        "content": user_post
                    }
                }, status=201)
        
        except Exception as e:
            return JsonResponse({
                "status":"error",
                "message":f"Error creating post {e}"
            }, status=400)
        

    return JsonResponse({
        "status":"error",
        "message":"Method is not a post request"
    }, status=400)


@login_required
def create(request):
    if request.method == "POST":
        content = request.POST.get("caption")
        media = request.FILES.get("media")

        try:
            
            if media:
                create_post = Posts.objects.create(user=request.user, content=content, media=media, media_type='video' if media.name.endswith('.mp4') else 'image')    

            else:
                return JsonResponse({
                    "status":"error",
                    "message":"Media is empty. Please upload a media"
                }, status=400)

            create_post.save()
            return JsonResponse({
                    "status":"sucess",
                    "message":"Your post was successful.",
                    "content": create_post.content,
                    "payload": {
                        "id": create_post.id,
                        "user": create_post.user.username,
                        'profile': create_post.user.profile.profile_picture.url,
                        "media_url": create_post.media.url if create_post.media else None,
                        "created_at": create_post.created_at.strftime('%Y-%m-%d %H:%M:%S')
                    }
            }, status=201)
        

        except Exception as e:
            return JsonResponse({
                    "status":"error",
                    "message":f"Error posting: {e}"
            }, status=500)

    else:
        return JsonResponse({
            "status":"error",
            "message":"Invalid request method."
        }, status=400)
            


def view_feed_post(request, pk):
    all_posts = Posts.objects.annotate(
        is_liked_by_user=Exists(
            Like.objects.filter(pk=pk, post=OuterRef('pk'))
        )
    )
    this_post = Posts.objects.get(pk=pk)

    comments = this_post.comments.all()

    return render(request, 'view_post.html', {"this_post":this_post, "comments":comments, "all_posts":all_posts})


def Like_post(request, post_id):
    if request.method == 'POST':
        user = request.user
        post = get_object_or_404(Posts, id=post_id)

        try:
            existing_like = Like.objects.filter(user=user, post=post).first()

            if existing_like:
                existing_like.delete()
                messages.success(request, "You unliked the post.")
                return JsonResponse({
                    "status": "success",
                    "message": "You unliked the post.",
                    "liked": False,
                    "likes_count": post.likes.count()
                })
            else:
                Like.objects.create(user=user, post=post)
                messages.success(request, "You liked the post.")
                return JsonResponse({
                    "status": "success",
                    "message": "You liked the post.",
                    "liked": True,
                    "likes_count": post.likes.count()
                })

        except Exception as e:
            return JsonResponse({"status": "error", "message": f"Error liking post: {e}"}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method."}, status=400)
                


def comment_post(request, comment_id):
    if request.method == 'POST':
        user = request.user
        data = json.loads(request.body)
        user_comment = data.get("comment")
        post = get_object_or_404(Posts, id=comment_id)

        if user_comment:
            try:

                Comment.objects.create(user=user, post=post, content=user_comment)
                return JsonResponse({
                    "status": "success",
                    "comment_count": post.comments.count(),
                    "user_profile": user.profile.profile_picture.url
                }, status=201) 
            
            except Exception as e:
                return JsonResponse({
                    "status": "error",
                    "message": f"Error creating comment: {e}"
                }, status=500)

        return JsonResponse({
            "status": "error",
            "message": "Comment content is missing."
        }, status=400)

    return JsonResponse({
        "status": "error",
        "message": "Invalid request method."
    }, status=405) 