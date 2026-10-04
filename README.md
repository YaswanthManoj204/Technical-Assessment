# Nova Store

A dynamic e-commerce web application built with Django and PostgreSQL, inspired by the overall experience of modern technology product stores.

Nova Store provides a dynamic product catalog, category management, banner management, promotional content, user authentication, and an administrative dashboard for managing store content.

> This project was developed independently for an internship technical assessment. Apple Store was used only as a functional and visual reference. No Apple source code, branding, or proprietary assets were copied.

---

## Live Demo

**Live Website:**

https://nova-store-india.vercel.app/

**Admin Panel:**

https://nova-store-india.vercel.app/admin/login/?next=/admin/

---

### 5. GitHub Repository

https://github.com/YaswanthManoj204/Technical-Assessment

---

## Test Credentials

### Test User

- Username: `testuser`
- Email: `test@example.com`
- Password: `Test@12345`

### Admin

- Username: `yaswanthmanoj`
- Email: `yaswanthmanoj80@gmail.com`
- Password: `134625`

---

## Features

### Homepage

- Responsive navigation bar
- Dynamic hero/banner section
- Featured products
- Product categories
- Promotional section
- Product showcase sections
- Footer
- Responsive mobile navigation
- Search interface
- Cart interface

### Dynamic Banner Management

Administrators can:

- Add banners
- Edit banners
- Delete banners
- Upload banner images
- Update banner title
- Update subtitle and description
- Configure button text and link
- Enable or disable banners
- Control display order

Changes made through Django Admin are reflected dynamically on the website.

### Product Management

Administrators can:

- Add products
- Edit products
- Delete products
- Upload product images
- Set product name
- Set description
- Set price
- Assign categories
- Enable or disable products
- Mark products as featured

### Categories

Administrators can:

- Create categories
- Edit categories
- Delete categories
- Upload category images
- Enable or disable categories

### Product Details

Each active product has its own detail page containing:

- Product image
- Product name
- Description
- Price
- Category
- Product information

### Authentication

The application supports:

- User registration
- User login
- User logout
- Protected account page
- Django authentication
- Password validation

### Admin Panel

Django Admin is used to manage:

- Products
- Categories
- Banners
- Promotions
- Users
- Groups

The admin interface has been customized with Nova Store branding.

---

## Technology Stack

### Backend

- Python
- Django
- Django Authentication
- Django Admin

### Frontend

- HTML5
- CSS3
- JavaScript

### Database

- PostgreSQL
- Neon PostgreSQL

### Image Storage

- Cloudinary

### Deployment

- Vercel

### Static Files

- WhiteNoise

### Python Packages

- Django
- psycopg
- dj-database-url
- python-dotenv
- Pillow
- WhiteNoise
- Cloudinary

---

## Database Models

The application uses Django ORM with PostgreSQL.

### Category

Stores product categories.

Main fields:

- Name
- Slug
- Description
- Image
- Active status
- Created date

### Product

Stores product information.

Main fields:

- Category
- Name
- Slug
- Description
- Price
- Image
- Active status
- Featured status
- Created date
- Updated date

### Banner

Stores homepage banner content.

Main fields:

- Title
- Subtitle
- Description
- Image
- Button text
- Button link
- Active status
- Display order
- Created date

### Promotion

Stores promotional content displayed on the homepage.

Main fields:

- Title
- Description
- Button text
- Button link
- Active status
- Created date

---

## Project Architecture

```text
Nova Store
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── ...
│
├── products/
│   ├── migrations/
│   ├── static/
│   │   └── products/
│   │       ├── css/
│   │       ├── js/
│   │       └── images/
│   ├── templates/
│   │   ├── home.html
│   │   └── products/
│   │       └── product_detail.html
│   ├── admin.py
│   ├── models.py
│   ├── urls.py
│   └── views.py
│
├── accounts/
│   ├── migrations/
│   ├── templates/
│   │   └── accounts/
│   │       ├── login.html
│   │       ├── register.html
│   │       └── account.html
│   ├── admin.py
│   ├── urls.py
│   └── views.py
│
├── manage.py
├── requirements.txt
├── .gitignore
└── README.md