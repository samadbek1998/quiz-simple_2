from django.urls import path
from .views import  \
    (QuizListView,
     quiz_view,
     quiz_data_view,
     save_quiz_view)

app_name = 'quizes'

urlpatterns = [
    path ('', QuizListView.as_view(), name = 'main-view'),
    path ('<pk>/', quiz_view, name = 'quiz_view' ),
    path ('<pk>/save/', save_quiz_view, name = 'save_view' ),
    path ('<pk>/data/', quiz_data_view, name = 'quiz_data_view')
]