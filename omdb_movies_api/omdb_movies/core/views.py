from django.contrib.auth.models import Group
from rest_framework import viewsets, generics
from rest_framework import permissions

from omdb_movies.core.custom_permisssions import IsOwner
from omdb_movies.core.models import CustomUser, Favorite
from omdb_movies.core.serializers import UserSerializer, GroupSerializer, RegisterSerializer, FavoriteSerializer


class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    """
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = CustomUser.objects.all().order_by('-created_at')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'head', 'patch', 'put']

    def get_object(self):
        pk = self.kwargs.get('pk')
        if pk == "current":
            return self.request.user

        return super(UserViewSet, self).get_object()


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class FavoriteViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows favorite movies to be viewed or edited.
    """
    queryset = Favorite.objects.all().order_by('-created_at')
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwner,]
