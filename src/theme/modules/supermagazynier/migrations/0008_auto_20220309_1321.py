# Generated by Django 3.1.2 on 2022-03-09 13:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('supermagazynier', '0007_auto_20220309_1302'),
    ]

    operations = [
        migrations.AddField(
            model_name='verifyproducts',
            name='Code_variants',
            field=models.CharField(default='', max_length=250),
        ),
        migrations.AddField(
            model_name='verifyproducts',
            name='Name',
            field=models.CharField(default='', max_length=250),
        ),
    ]
