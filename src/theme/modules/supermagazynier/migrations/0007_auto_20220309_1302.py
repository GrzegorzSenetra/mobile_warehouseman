# Generated by Django 3.1.2 on 2022-03-09 13:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('supermagazynier', '0006_auto_20210419_0732'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='verifyproducts',
            name='Quantity',
        ),
        migrations.AddField(
            model_name='verifyproducts',
            name='Quantity_counted',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='verifyproducts',
            name='Quantity_in_store',
            field=models.IntegerField(default=0),
        ),
    ]
