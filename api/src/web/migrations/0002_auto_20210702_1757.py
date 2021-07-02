# Generated by Django 3.2.4 on 2021-07-02 17:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='camera',
            name='name',
            field=models.CharField(default='', max_length=80),
        ),
        migrations.AddField(
            model_name='image',
            name='labels',
            field=models.JSONField(default={}),
        ),
    ]
