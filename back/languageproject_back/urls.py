"""
URL configuration for languageproject_back project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
import api.views as api_views
urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/register/", api_views.register),
    path("api/login/", api_views.login),
    path("api/get_languages/", api_views.get_languages),
    path("api/createvocab/", api_views.create_vocab),
    path("api/getvocab/", api_views.get_vocab),
    path("api/getvocabsets/", api_views.get_vocab_sets),
    path("api/getlanguagevocab/", api_views.get_language_vocab),
    path("api/checktoken/", api_views.check_token),
    path("api/getownsets/", api_views.get_own_sets),
    path("api/deleteset/", api_views.delete_set),
    path("api/editvocab/", api_views.edit_vocab),
    path("api/addresult/", api_views.add_result),
    path("api/sendvocabresult/", api_views.send_vocab_result),
    path("api/gethighscore/", api_views.get_high_score),
    path("api/getusername/", api_views.get_username),
    path("api/saveset/", api_views.save_set),
    path("api/getsavestatus/", api_views.get_save_status),
    path("api/logout/", api_views.logout),
    path("api/test/", api_views.test)
]
