# Generated by Django 4.2.7 on 2024-08-26 14:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_rename_one_of_three_correct_wordrecord_one_of_three_score_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='vocabularysetrecord',
            name='mode',
            field=models.CharField(choices=[('OTT', 'One Of Three'), ('WTA', 'Write The Answer')], default='OTT', max_length=16),
        ),
    ]