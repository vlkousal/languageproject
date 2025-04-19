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
import users.views as user_views
import vocabulary.views as vocab_views
urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/register/", user_views.register),
    path("api/login/", user_views.login),
    path("api/getlanguages/", vocab_views.get_languages),
    path("api/createvocab/", vocab_views.create_vocab),
    path("api/getvocab/", vocab_views.get_vocab),
    path("api/getvocabsets/", vocab_views.get_vocab_sets),
    path("api/getlanguagevocab/", vocab_views.get_language_vocab),
    path("api/checktoken/", user_views.check_token),
    path("api/getownsets/", vocab_views.get_own_sets),
    path("api/deleteset/", vocab_views.delete_set),
    path("api/editvocab/", vocab_views.edit_vocab),
    path("api/addresult/", vocab_views.add_result),
    path("api/sendvocabresult/", vocab_views.send_vocab_result),
    path("api/gethighscore/", vocab_views.get_high_score),
    path("api/getusername/", user_views.get_username),
    path("api/saveset/", vocab_views.save_set),
    path("api/getsavestatus/", vocab_views.get_save_status),
    path("api/logout/", user_views.logout),
    path("api/checkimage/", vocab_views.check_image),
    path("api/getuserinfo/", user_views.get_user_info),
    path("api/updateuserinfo/", user_views.update_user_info),
    path("api/updateprofilepicture/", user_views.update_profile_picture),
    path("api/getvocabcategories/", vocab_views.get_vocabulary_categories)
]
