# Generated by Django 3.1.2 on 2022-03-24 13:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('supermagazynier', '0009_verifyproducts_unit'),
    ]

    operations = [
        migrations.AddField(
            model_name='verifydocument',
            name='Correctness',
            field=models.BooleanField(default=False),
        ),
    ]
