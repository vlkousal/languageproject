# Generated by Django 4.2.7 on 2024-10-28 22:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_remove_vocabularyuserrelationship_rating'),
    ]

    operations = [
        migrations.RenameField(
            model_name='wordentry',
            old_name='second',
            new_name='translation',
        ),
        migrations.RenameField(
            model_name='wordentry',
            old_name='first',
            new_name='word',
        ),
        migrations.RemoveField(
            model_name='vocabularyset',
            name='second_language',
        ),
    ]