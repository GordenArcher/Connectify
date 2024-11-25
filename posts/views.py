from django.shortcuts import render, redirect
from .models import Posts
from django.contrib import messages
from django.contrib.auth.decorators import login_required

# Create your views here.
def feed(request):
    all_posts = Posts.objects.all().order_by("created_at")
    context = {
        "allpost": all_posts
    }

    username = "GORDEN"

    return render(request, 'posts.html', context)


@login_required
def create(request):
    if request.method == "POST":
        content = request.POST['description']
        image=request.FILES.get('image')

        if not image:
            messages.error(request, "Description is empty")
            return redirect("create")

        try:
            create_post = Posts.objects.create(user=request.user, content=content, image=image)
            create_post.save()
            messages.success(request,"Your post was successful")
            return redirect("create")
        
        except Exception as e:
            messages.error(request, f"Error posting {e}")
            return redirect("create")
        

    return render(request, 'create_post.html')
            
