from django.db import models

class UserDetail(models.Model):
    FullName = models.CharField(max_length=100)
    Email = models.EmailField(max_length=100, unique=True)
    Password = models.CharField(max_length=100)
    RegDate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.Email


class Expense(models.Model):
    UserId = models.ForeignKey(UserDetail, on_delete=models.CASCADE)
    ExpenseDate = models.DateField(null=True, blank=True)
    ExpenseItem = models.CharField(max_length=100)
    ExpenseAmount = models.FloatField()
    NoteDate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.ExpenseItem
