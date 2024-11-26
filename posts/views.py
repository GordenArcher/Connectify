from django.shortcuts import render, redirect
from .models import Posts
from django.contrib import messages
from django.contrib.auth.decorators import login_required
import mimetypes

# Create your views here.
def feed(request):
    all_posts = Posts.objects.all().order_by("created_at")
    context = {
        "allpost": all_posts
    }

    return render(request, 'posts.html', context)


@login_required
def create(request):
    if request.method == "POST":
        content = request.POST.get('description')  # Use get to avoid KeyError if the description is missing
        media = request.FILES.get('media')

        if not media:
            messages.error(request, "Media is empty")
            return redirect("create")

        file_type, _ = mimetypes.guess_type(media.name)


        try:
            if file_type and file_type.startswith('image'):
                create_post = Posts.objects.create(user=request.user, content=content, image=media)
            
            elif file_type and file_type.startswith('video'):
                create_post = Posts.objects.create(user=request.user, content=content, video=media)

            else:
                messages.error(request, "Invalid media type. Please upload an image or a video.")
                return redirect("create")

            create_post.save()
            messages.success(request, "Your post was successful")
            return redirect("create")

        except Exception as e:
            messages.error(request, f"Error posting: {e}")
            return redirect("create")

    return render(request, 'create_post.html')
            
