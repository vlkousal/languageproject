# Generated by Django 4.2.7 on 2024-08-29 17:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_alter_vocabularysetrecord_mode'),
    ]

    operations = [
        migrations.AddField(
            model_name='wordrecord',
            name='draw_character_score',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='wordrecord',
            name='draw_character_streak',
            field=models.IntegerField(default=0),
        ),
    ]