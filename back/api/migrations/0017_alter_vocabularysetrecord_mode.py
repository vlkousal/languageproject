# Generated by Django 4.2.7 on 2024-08-26 14:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_alter_vocabularysetrecord_mode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vocabularysetrecord',
            name='mode',
            field=models.CharField(choices=[('0', 'One Of Three'), ('1', 'Write The Answer')], default='0', max_length=16),
        ),
    ]
