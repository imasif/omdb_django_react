from django.contrib import admin

from omdb_movies.core.models import CustomUser as User

admin.site.register(User)
# Register your models here.
