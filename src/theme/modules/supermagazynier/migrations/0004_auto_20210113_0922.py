# Generated by Django 3.1.2 on 2021-01-13 09:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('supermagazynier', '0003_auto_20210113_0916'),
    ]

    operations = [
        migrations.AddField(
            model_name='listofproducts',
            name='id',
            field=models.AutoField(auto_created=True, default=0, primary_key=True, serialize=False, verbose_name='ID'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='listofproducts',
            name='Product',
            field=models.IntegerField(),
        ),
        migrations.AlterUniqueTogether(
            name='listofproducts',
            unique_together={('Document', 'Product')},
        ),
    ]
