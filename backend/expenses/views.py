from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import *

# User Signup View

@csrf_exempt
def signup(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'message': 'Invalid JSON'}, status=400)

    FullName = data.get('FullName')
    Email = data.get('Email')
    Password = data.get('Password')
    ConfirmPassword = data.get('ConfirmPassword')

    if not (FullName and Email and Password and ConfirmPassword):
        return JsonResponse({'message': 'Missing required fields'}, status=400)

    if Password != ConfirmPassword:
        return JsonResponse({'message': 'Passwords do not match'}, status=400)

    if UserDetail.objects.filter(Email=Email).exists():
        return JsonResponse({'message': 'User already exists'}, status=400)

    user = UserDetail.objects.create(
        FullName=FullName,
        Email=Email,
        Password=Password
    )

    return JsonResponse({'message': 'Signup successful!', 'user_id': user.id}, status=200)

# User Login View

@csrf_exempt
def login(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'message': 'Invalid JSON'}, status=400)

    Email = data.get('Email')
    Password = data.get('Password')

    if not (Email and Password):
        return JsonResponse({'message': 'Missing required fields'}, status=400)

    try:
        user = UserDetail.objects.get(Email=Email, Password=Password)
        return JsonResponse({'message': 'Login successful!', 'user_id': user.id, 'UserName': user.FullName}, status=200)
    except UserDetail.DoesNotExist:
        return JsonResponse({'message': 'Invalid email or password'}, status=400)

# Add Expense View

@csrf_exempt
def add_expense(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'message': 'Invalid JSON'}, status=400)

    user_id = data.get('UserId') or data.get('UserID') or data.get('user_id')
    ExpenseDate = data.get('ExpenseDate')
    ExpenseItem = data.get('ExpenseItem')
    ExpenseAmount = data.get('ExpenseAmount')

    if not user_id:
        return JsonResponse({'message': 'UserId is required'}, status=400)

    try:
        user = UserDetail.objects.get(id=user_id)
    except UserDetail.DoesNotExist:
        return JsonResponse({'message': 'User not found'}, status=400)

    if not (ExpenseItem and ExpenseAmount):
        return JsonResponse({'message': 'ExpenseItem and ExpenseAmount are required'}, status=400)

    try:
        # pass the UserDetail instance to the ForeignKey field
        Expense.objects.create(
            UserId=user,
            ExpenseDate=ExpenseDate,
            ExpenseItem=ExpenseItem,
            ExpenseAmount=ExpenseAmount
        )
        return JsonResponse({'message': 'Expense added successfully!'}, status=200)
    except Exception as e:
        return JsonResponse({'message': 'Failed to add expense.', 'error': str(e)}, status=400)



# manage expenses view (list expenses for a user)
@csrf_exempt
def manage_expenses(request, user_id):
    if request.method != 'GET':
        return JsonResponse({'message': 'Method not allowed'}, status=405)

    try:
        user = UserDetail.objects.get(id=user_id)
    except UserDetail.DoesNotExist:
        return JsonResponse({'message': 'User not found'}, status=400)

    expenses = Expense.objects.filter(UserId=user).order_by('-id')

    expense_list = []
    for expense in expenses:
        expense_list.append({
            'id': expense.id,                      # normalized id for frontend
            'ExpenseDate': expense.ExpenseDate,
            'ExpenseItem': expense.ExpenseItem,
            'ExpenseAmount': expense.ExpenseAmount
        })

    return JsonResponse({'expenses': expense_list}, status=200)


@csrf_exempt
def update_expense(request, expense_id):
    if request.method not in ('PUT', 'PATCH'):
        return JsonResponse({'message': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'message': 'Invalid JSON'}, status=400)

    try:
        expense = Expense.objects.get(id=expense_id)
    except Expense.DoesNotExist:
        return JsonResponse({'message': 'Expense not found'}, status=404)

    ExpenseDate = data.get('ExpenseDate')
    ExpenseItem = data.get('ExpenseItem')
    ExpenseAmount = data.get('ExpenseAmount')

    if ExpenseDate is not None:
        expense.ExpenseDate = ExpenseDate
    if ExpenseItem is not None:
        expense.ExpenseItem = ExpenseItem
    if ExpenseAmount is not None:
        expense.ExpenseAmount = ExpenseAmount

    expense.save()

    # return updated object in API format
    updated = {
        'id': expense.id,
        'ExpenseDate': expense.ExpenseDate,
        'ExpenseItem': expense.ExpenseItem,
        'ExpenseAmount': expense.ExpenseAmount
    }
    return JsonResponse({'message': 'Expense updated successfully!', 'expense': updated}, status=200)


@csrf_exempt
def delete_expense(request, id):
    if request.method == 'DELETE':
        try:
            expense = Expense.objects.get(id=id)
            expense.delete()
            return JsonResponse({
                'message': 'Expense deleted successfully',
                'success': True
            }, status=200)
        except Expense.DoesNotExist:
            return JsonResponse({
                'message': 'Expense not found',
                'success': False
            }, status=404)
        except Exception as e:
            print(f"Error deleting expense: {str(e)}")  # Debug logging
            return JsonResponse({
                'message': f'Error: {str(e)}',
                'success': False
            }, status=500)
    else:
        return JsonResponse({
            'message': 'Method not allowed',
            'success': False
        }, status=405)

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Sum
from .models import Expense, UserDetail

@csrf_exempt
def search_expense(request, user_id):
    # Only allow GET requests
    if request.method != 'GET':
        return JsonResponse({'message': 'Method not allowed'}, status=405)

    # Extract query parameters
    from_date = request.GET.get('from')
    to_date = request.GET.get('to')

    # Validate dates
    if not from_date or not to_date:
        return JsonResponse({'message': 'Both from and to dates are required'}, status=400)

    # Validate user
    try:
        user = UserDetail.objects.get(id=user_id)
    except UserDetail.DoesNotExist:
        return JsonResponse({'message': 'User not found'}, status=404)

    # Filter expenses between the given dates
    expenses = Expense.objects.filter(
        UserId=user,
        ExpenseDate__range=[from_date, to_date]
    ).order_by('ExpenseDate')

    # Calculate total expense amount
    total = expenses.aggregate(total=Sum('ExpenseAmount'))['total'] or 0

    # Convert queryset to a list of dictionaries
    expenses_list = list(expenses.values(
        'id',
        'ExpenseDate',
        'ExpenseItem',
        'ExpenseAmount'
    ))

    # Return JSON response
    return JsonResponse({
        'expenses': expenses_list,
        'total': float(total)
    }, safe=False, status=200)

# Change Password View

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def change_password(request, user_id):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'message': 'Invalid JSON'}, status=400)

    old_password = data.get('old_password')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')

    if not (old_password and new_password and confirm_password):
        return JsonResponse({'message': 'Missing required fields'}, status=400)

    if new_password != confirm_password:
        return JsonResponse({'message': 'New passwords do not match'}, status=400)

    try:
        user = UserDetail.objects.get(id=user_id)
    except UserDetail.DoesNotExist:
        return JsonResponse({'message': 'User not found'}, status=404)

    # Example insecure password check (replace with proper hash check in production)
    if user.Password != old_password:
        return JsonResponse({'message': 'Old password is incorrect'}, status=400)

    # Change password
    user.Password = new_password
    user.save()

    return JsonResponse({'message': 'Password changed successfully!'}, status=200)
