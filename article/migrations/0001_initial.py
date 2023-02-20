# Generated by Django 4.1.7 on 2023-02-20 13:58

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Articles',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=256)),
                ('category', models.CharField(blank=True, max_length=100)),
                ('created', models.DateTimeField(auto_now=True)),
                ('article', models.TextField()),
            ],
        ),
    ]
