# Generated by Django 5.1.3 on 2024-12-04 04:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0007_remove_posts_image_remove_posts_video_posts_media'),
    ]

    operations = [
        migrations.AlterField(
            model_name='posts',
            name='media',
            field=models.FileField(blank=True, null=True, upload_to='post_media'),
        ),
    ]