from django.shortcuts import render, get_object_or_404
from .models import Posts, Like, Comment
from users.models import FriendRequest
from django.contrib import messages
from django.contrib.auth.decorators import login_required
import mimetypes
from django.http import JsonResponse
import json
from django.contrib.auth.models import User

def feed(request):
    all_posts = Posts.objects.all().order_by("-created_at")
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

        if not media:
            return JsonResponse({
                "status":"error",
                "message":"Media is empty. Please upload a media"
            }, status=400)

        file_type, _ = mimetypes.guess_type(media.name)


        try:
            if file_type and file_type.startswith('image'):
                create_post = Posts.objects.create(user=request.user, content=content, image=media)
            
            elif file_type and file_type.startswith('video'):
                create_post = Posts.objects.create(user=request.user, content=content, video=media)    

            else:
                return JsonResponse({
                    "status":"error",
                    "message":"Invalid media type. Please upload an image or a video."
                }, status=400)

            create_post.save()
            return JsonResponse({
                    "status":"sucess",
                    "message":"Your post was successful.",
                    "payload":create_post
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
    this_post = Posts.objects.get(pk=pk)

    comments = this_post.comments.all()

    return render(request, 'view_post.html', {"this_post":this_post, "comments":comments})


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