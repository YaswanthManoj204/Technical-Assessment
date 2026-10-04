from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(
        upload_to="categories/",
        blank=True,
        null=True
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="products"
    )
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    image = models.ImageField(upload_to="products/")
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Banner(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(
        max_length=300,
        blank=True
    )
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="banners/")
    button_text = models.CharField(
        max_length=100,
        blank=True
    )
    button_link = models.CharField(
        max_length=300,
        blank=True
    )
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Promotion(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    button_text = models.CharField(
        max_length=100,
        blank=True
    )
    button_link = models.CharField(
        max_length=300,
        blank=True
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title