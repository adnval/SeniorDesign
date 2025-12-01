from django.urls import path,include
from . import views

urlpatterns = [
    #suppliers
    path('suppliers/',views.SupplierList.as_view()),
    path('supplier/<int:pk>/', views.SupplierDetail.as_view()),
    
    # address URLs
    path('addresses/', views.AddressList.as_view(), name='address-list'),
    path('addresses/<int:pk>/', views.AddressDetail.as_view(), name='address-detail'),

    # Staff URLs
    path('staff/', views.StaffList.as_view(), name='staff-list'),
    path('staff/<int:pk>/', views.StaffDetail.as_view(), name='staff-detail'),

    # Customer URLs
    path('customers/', views.CustomerList.as_view(), name='customer-list'),
    path('customers/<int:pk>/', views.CustomerDetail.as_view(), name='customer-detail'),
    path('customers/login/', views.customer_login,name='customer_login'),
    path('customers/register/', views.customer_register,name='customer_register'),



    # Product URLs
    path('products/', views.ProductList.as_view(), name='product-list'),
    path('products/<int:pk>/', views.ProductDetail.as_view(), name='product-detail'),

    # Order URLs
    path('orders/', views.OrderList.as_view(), name='order-list'),
    path('orders/<int:pk>/', views.OrderDetail.as_view(), name='order-detail'),

    # OrderItem URLs
    path('order-items/', views.OrderItemList.as_view(), name='orderitem-list'),
    path('order-items/<int:pk>/', views.OrderItemDetail.as_view(), name='orderitem-detail'),

    # Card URLs
    path('cards/', views.CardList.as_view(), name='card-list'),
    path('cards/<int:pk>/', views.CardDetail.as_view(), name='card-detail'),

    # DeliveryPlan URLs
    path('delivery-plans/', views.DeliveryPlanList.as_view(), name='deliveryplan-list'),
    path('delivery-plans/<int:pk>/', views.DeliveryPlanDetail.as_view(), name='deliveryplan-detail'),

    # Warehouse URLs
    path('warehouses/', views.WarehouseList.as_view(), name='warehouse-list'),
    path('warehouses/<int:pk>/', views.WarehouseDetail.as_view(), name='warehouse-detail'),
    
    #Category URL
    path('categories/', views.CategoryList.as_view(), name='Category-list'),
    

]
