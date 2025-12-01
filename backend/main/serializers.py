from rest_framework import serializers
from .models import *

class AddressSerializer(serializers.ModelSerializer):
    isCustomer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    class Meta:
        model = Address
        fields = '__all__'        
class AddressDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

        
class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'       
class StaffDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
class CustomerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
 
class DeliveryPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryPlans
        fields = '__all__'
class DeliveryPlanDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryPlans
        fields = '__all__'    
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    model = OrderItem
    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True, source='orderitem_set')
    delivery_plan = DeliveryPlanSerializer(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

class OrderDetailSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True, source='orderitem_set')

    class Meta:
        model = Order
        fields = '__all__'

class OrderItemDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class CardSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())

    class Meta:
        model = Card
        fields = '__all__'

class CardDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'
        

        
class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'
    
    #will show user data - goes down a level of depth 
    # def __init__(self, *args, **kwargs):
    #     super(SupplierSerializer, self).__init__(*args, **kwargs)
    #     self.Meta.depth = 1
class SupplierDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'
    # def __init__(self, *args, **kwargs):
    #     super(SupplierDetailSerializer, self).__init__(*args, **kwargs)
    #     self.Meta.depth = 1


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'
class WarehouseDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

        
