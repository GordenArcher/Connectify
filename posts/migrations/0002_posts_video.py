# Generated by Django 5.1.3 on 2024-11-26 04:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='posts',
            name='video',
            field=models.FileField(blank=True, null=True, upload_to='post_images/'),
        ),
    ]