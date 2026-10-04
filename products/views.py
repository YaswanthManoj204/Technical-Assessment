from django.shortcuts import render, get_object_or_404

from .models import Category, Product, Banner, Promotion


def home_view(request):
    banners = Banner.objects.filter(
        is_active=True
    ).order_by("display_order")

    categories = Category.objects.filter(
        is_active=True
    ).order_by("name")

    featured_products = Product.objects.filter(
        is_active=True,
        is_featured=True
    ).select_related("category").order_by("-created_at")

    showcase_products = Product.objects.filter(
        is_active=True,
        name__in=[
            "Nova X1 Pro",
            "NovaBook Pro 14",
            "Nova Watch Pro",
        ]
    )

    showcase_products_map = {
        product.name: product
        for product in showcase_products
    }

    promotion = Promotion.objects.filter(
        is_active=True
    ).order_by("-created_at").first()

    context = {
        "banners": banners,
        "categories": categories,
        "featured_products": featured_products,
        "promotion": promotion,
        "nova_x1_pro": showcase_products_map.get("Nova X1 Pro"),
        "nova_book_pro": showcase_products_map.get("NovaBook Pro 14"),
        "nova_watch_pro": showcase_products_map.get("Nova Watch Pro"),
    }

    return render(request, "home.html", context)


def product_detail_view(request, slug):
    product = get_object_or_404(
        Product.objects.select_related("category"),
        slug=slug,
        is_active=True
    )

    return render(
        request,
        "products/product_detail.html",
        {"product": product}
    )