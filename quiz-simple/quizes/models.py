from django.db import models
import random
# Create your models here.

DIF_CHOICES = (
    ('easy', 'easy'),
    ('medium', 'medium'),
    ('hard','hard')
)

class Quiz(models.Model):
    name = models.CharField(max_length=120)
    topic = models.CharField(max_length=120)
    number_of_questions = models.IntegerField()
    time = models.IntegerField(help_text='duration of the quiz in minutes')
    require_score_to_pass = models.IntegerField(help_text='required score to %')
    difficulty = models.CharField(max_length=6, choices=DIF_CHOICES)

    def __str__(self):
        return f"{self.name} - {self.topic}"

    def get_questions(self):
        questions = list(self.question_set.all())
        random.shuffle(questions)
        return questions[:self.number_of_questions]

    class Meta:
        verbose_name_plural = 'Quizes'