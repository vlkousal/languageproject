# Generated by Django 4.2.7 on 2024-08-29 18:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_wordrecord_draw_character_score_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vocabularysetrecord',
            name='mode',
            field=models.CharField(choices=[('0', 'One Of Three'), ('1', 'Write The Answer'), ('2', 'Flashcards'), ('3', 'Draw Characters')], default='0', max_length=16),
        ),
    ]
