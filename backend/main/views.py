from queue import Full
from rest_framework import generics, permissions, viewsets
import logging

from . import models
from . import serializers
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.contrib.auth.models import User


# Address Views
class AddressList(generics.ListCreateAPIView):
    queryset = models.Address.objects.all()
    serializer_class = serializers.AddressSerializer
    # permission_classes = [permissions.IsAuthenticated]

class AddressDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Address.objects.all()
    serializer_class = serializers.AddressSerializer
    # permission_classes = [permissions.IsAuthenticated]


# Staff Views
class StaffList(generics.ListAPIView):
    queryset = models.Staff.objects.all()
    serializer_class = serializers.StaffSerializer
    # permission_classes = [permissions.IsAuthenticated]

class StaffDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Staff.objects.all()
    serializer_class = serializers.StaffSerializer
    # permission_classes = [permissions.IsAuthenticated]

# Customer Views
class CustomerList(generics.ListAPIView):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.CustomerSerializer
    # permission_classes = [permissions.IsAuthenticated]

class CustomerDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.CustomerSerializer
    # permission_classes = [permissions.IsAuthenticated]

@csrf_exempt
def customer_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user:
            customer = models.Customer.objects.get(user=user)
            msg = {
                'bool': True,
                'user': user.username,
                'customer_id': customer.id
            }
        else:
            msg = {
                'bool': False,
                'msg': 'Invalid Username/Password'
            }
        response = JsonResponse(msg)
        return response
    else:
        return JsonResponse({'bool': False, 'msg': 'Invalid request method'})
 

logger = logging.getLogger(__name__)

@csrf_exempt
def customer_register(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        username = request.POST.get('username')
        password = request.POST.get('password')

        try:
            # Check if user already exists
            if User.objects.filter(username=username).exists():
                return JsonResponse({'bool': False, 'msg': 'Username already exists'})

            user = User.objects.create_user(username=username, password=password)
            customer = models.Customer.objects.create(user=user, full_name=name, balance=0)
            
            msg = {
                'bool': True,
                'user': user.username,  # Send username or any other identifier if needed
                'customer': customer.id
            }
        except Exception as e:
            msg = {
                'bool': False,
                'msg': f'Oops... something went wrong: {str(e)}'
            }
        
        response = JsonResponse(msg)
        return response
    else:
        return JsonResponse({'bool': False, 'msg': 'Invalid request method'})

# Product Views
class ProductList(generics.ListAPIView):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductSerializer
    # permission_classes = [permissions.IsAuthenticated]

class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductSerializer
    # permission_classes = [permissions.IsAuthenticated]

# Order Views
class OrderList(generics.ListCreateAPIView):
    queryset = models.Order.objects.all()
    serializer_class = serializers.OrderSerializer
    # permission_classes = [permissions.IsAuthenticated]

class OrderDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.OrderSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return models.Order.objects.all()

    def get_object(self):
        order_id = self.kwargs['pk']
        return models.Order.objects.get(id=order_id)

# OrderItem Views
class OrderItemList(generics.ListCreateAPIView):
    queryset = models.OrderItem.objects.all()
    serializer_class = serializers.OrderItemSerializer
    # permission_classes = [permissions.IsAuthenticated]

class OrderItemDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.OrderItemSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        order_id = self.kwargs['order_pk']  # Assuming you pass order_id as 'order_pk'
        return models.OrderItem.objects.filter(order__id=order_id)

    def get_object(self):
        order_item_id = self.kwargs['pk']
        return generics.get_object_or_404(models.OrderItem, id=order_item_id)

# Card Views
class CardList(generics.ListCreateAPIView):
    queryset = models.Card.objects.all()
    serializer_class = serializers.CardSerializer
    # permission_classes = [permissions.IsAuthenticated]

class CardDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Card.objects.all()
    serializer_class = serializers.CardSerializer
    # permission_classes = [permissions.IsAuthenticated]

# DeliveryPlan Views
class DeliveryPlanList(generics.ListCreateAPIView):
    queryset = models.DeliveryPlans.objects.all()
    serializer_class = serializers.DeliveryPlanSerializer
    # permission_classes = [permissions.IsAuthenticated]

class DeliveryPlanDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.DeliveryPlans.objects.all()
    serializer_class = serializers.DeliveryPlanSerializer
    # permission_classes = [permissions.IsAuthenticated]

# Warehouse Views
class WarehouseList(generics.ListAPIView):
    queryset = models.Warehouse.objects.all()
    serializer_class = serializers.WarehouseSerializer
    # permission_classes = [permissions.IsAuthenticated]

class WarehouseDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Warehouse.objects.all()
    serializer_class = serializers.WarehouseSerializer
    # permission_classes = [permissions.IsAuthenticated]

class SupplierList(generics.ListAPIView):
    queryset = models.Supplier.objects.all()
    serializer_class = serializers.SupplierSerializer
    #permission_classes=[permissions.IsAuthenticated]
    
class SupplierDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Supplier.objects.all()
    serializer_class = serializers.SupplierDetailSerializer
    #permission_classes=[permissions.IsAuthenticated]

class CategoryList(generics.ListAPIView):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
    
