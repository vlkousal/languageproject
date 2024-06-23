# Generated by Django 4.0.4 on 2023-11-17 00:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='WordEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first', models.CharField(max_length=64)),
                ('phonetic', models.CharField(max_length=64)),
                ('second', models.CharField(max_length=64)),
                ('first_language', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='word_language', to='api.language')),
                ('second_language', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translation_language', to='api.language')),
            ],
        ),
        migrations.CreateModel(
            name='VocabularySet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
                ('description', models.CharField(max_length=256)),
                ('url', models.CharField(max_length=32)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('first_language', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='set_first_language', to='api.language')),
                ('second_language', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='set_second_language', to='api.language')),
                ('vocabulary', models.ManyToManyField(to='api.wordentry')),
            ],
        ),
    ]