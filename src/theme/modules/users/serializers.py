from rest_framework import serializers

from .models import Account

class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = ['id', 'email', 'username', 'password', 'accepted']
        extra_kwargs = {
            'password': {'write_only': True}
        }
