# Generated by Django 5.1.3 on 2024-11-26 04:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='profile_picture',
            field=models.FileField(blank=True, null=True, upload_to='profile_pictures/'),
        ),
    ]
