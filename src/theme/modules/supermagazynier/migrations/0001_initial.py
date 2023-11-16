# Generated by Django 3.1.2 on 2020-11-30 10:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Nazwa', models.CharField(max_length=200, null=True)),
                ('Data_dodania', models.DateField()),
                ('Author', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Kod', models.CharField(max_length=20, unique=True)),
                ('Nazwa', models.CharField(max_length=200, null=True)),
                ('Kod_kreskowy', models.CharField(max_length=13, null=True)),
                ('Numer_katalogowy', models.CharField(max_length=11, null=True)),
                ('Stany_lacznie', models.CharField(max_length=20, null=True)),
                ('Ostatnia_zakupuN', models.FloatField()),
                ('DetalicznaN', models.FloatField()),
                ('DetalicznaB', models.FloatField()),
                ('Sklep_intB', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='VerifyDocument',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Author', models.IntegerField()),
                ('Title', models.CharField(default='default', max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='VerifyProducts',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Index', models.CharField(max_length=40, unique=True)),
                ('Quantity', models.IntegerField()),
                ('Document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='supermagazynier.verifydocument')),
            ],
        ),
        migrations.CreateModel(
            name='ListOfProducts',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Product', models.IntegerField(null=True)),
                ('Quantity', models.FloatField(default=0, null=True)),
                ('Document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='supermagazynier.document')),
            ],
        ),
    ]
