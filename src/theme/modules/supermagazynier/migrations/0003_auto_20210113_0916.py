# Generated by Django 3.1.2 on 2021-01-13 09:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('supermagazynier', '0002_verifydocument_verifyproducts'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Product',
        ),
        migrations.RemoveField(
            model_name='listofproducts',
            name='id',
        ),
        migrations.AlterField(
            model_name='listofproducts',
            name='Product',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
    ]
