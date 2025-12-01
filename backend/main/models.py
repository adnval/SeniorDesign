from django.db import models
from django.contrib.auth.models import User
from django.db import connection


# Database models - connected to postgresql
 
connection.queries

#customer
class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField()
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return self.user.username

#address
class Address(models.Model):
    street_address = models.CharField(max_length=50)
    secondary_address = models.CharField(null=True)
    zipcode = models.IntegerField()
    state = models.CharField(max_length=20)
    country = models.CharField(max_length=20)
    isCustomer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)


    def __str__(self):
        return f"{self.street_address}"

    
#staff
class Staff(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=50)
    salary = models.IntegerField()
    role = models.CharField(max_length=50)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.full_name}"

#supplier
class Supplier(models.Model):
    street_address = models.CharField(max_length=50)
    name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name}"
   

#warehouse
class Warehouse(models.Model):
    address = models.ForeignKey(Address, on_delete=models.CASCADE)
    max_capacity = models.IntegerField()
    capacity_filled = models.IntegerField()

    def __str__(self):
        return f"Warehouse {self.id}"

class Category(models.Model):
    name = models.CharField()
    image=models.ImageField(upload_to='category_imgs/',null=True)

    
    def __str__(self):
        return f"{self.name}"
    
#product
class Product(models.Model):
    product_name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='category_name', null=True)
    product_type = models.CharField(max_length=50)
    brand = models.CharField(max_length=50)
    size = models.CharField(max_length=50)
    description = models.CharField(max_length=500)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, related_name='products', null=True, blank=True)
    location = models.ForeignKey(Warehouse, on_delete=models.SET_NULL, related_name='products', null=True, blank=True)
    image=models.ImageField(upload_to='product_imgs/',null=True)


    def __str__(self):
        return self.product_name

   

#card
class Card(models.Model):
    card_no = models.BigIntegerField()
    full_name = models.CharField(max_length=50)
    card_nickname = models.CharField(max_length=50)
    security = models.IntegerField()
    exp_date = models.DateField()
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='cards')

    def __str__(self):
        return self.card_nickname
  
#order
class Order(models.Model):
    user = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20)
    card = models.ForeignKey(Card, on_delete=models.SET_NULL, null=True, blank=True)
    products = models.ManyToManyField(Product, through='OrderItem')
    shipping_address = models.ForeignKey(Address,on_delete=models.SET_NULL, null=True, blank=True, related_name='ship_order')
    billing_address = models.ForeignKey(Address,on_delete=models.SET_NULL, null=True, blank=True, related_name='bill_order')


    def __str__(self):
        return f"Order {self.id}"

#orderItem
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.IntegerField()

    def __str__(self):
        return f"{self.quantity} x {self.product.product_name} in Order {self.order.id}"

# deliveryPlan
class DeliveryPlans(models.Model):
    order = models.OneToOneField(Order, primary_key=True, on_delete=models.CASCADE)
    delivery_type = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    ship_date = models.CharField()
    delivery_date = models.CharField()

    def __str__(self):
        return f"Delivery for Order {self.order.id}"





    

   


