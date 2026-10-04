from django.contrib import admin

from .models import Category, Product, Banner, Promotion


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "is_active",
        "created_at",
    )
    list_filter = ("is_active",)
    search_fields = ("name", "slug")
    prepopulated_fields = {
        "slug": ("name",)
    }
    ordering = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "price",
        "is_active",
        "is_featured",
        "created_at",
    )
    list_filter = (
        "category",
        "is_active",
        "is_featured",
    )
    search_fields = (
        "name",
        "description",
        "slug",
    )
    prepopulated_fields = {
        "slug": ("name",)
    }
    ordering = ("-created_at",)


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "button_text",
        "is_active",
        "display_order",
        "created_at",
    )
    list_filter = ("is_active",)
    search_fields = (
        "title",
        "subtitle",
        "description",
    )
    ordering = ("display_order",)


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "button_text",
        "is_active",
        "created_at",
    )
    list_filter = ("is_active",)
    search_fields = (
        "title",
        "description",
    )
    ordering = ("-created_at",)