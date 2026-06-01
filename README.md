# 🎨 Arte Store — Galería de Productos Artísticos

> Ecommerce para descubrir y adquirir obras de arte únicas: pinturas, esculturas, fotografías, cerámicas y más.  
> Backend con **Express.js + MySQL** · Frontend con **Next.js** · Imágenes automáticas vía **Lorem Picsum API**

---

## 🔗 Links del Proyecto

| Recurso | URL |
|---------|-----|
| 🌐 Frontend en línea | `https://arte-store-frontend.up.railway.app` |
| 🔌 API en línea | `https://arte-store-backend.up.railway.app` |
| ❤️ Health check | `https://arte-store-backend.up.railway.app/health` |
| 📦 Repositorio | `https://github.com/NamiDev-79/arte-store` |



---

## 📂 Estructura del Proyecto

```
arte-store/
├── backend/                  # API RESTful con Express.js
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js   # Pool MySQL + inicialización + seed
│   │   ├── controllers/
│   │   │   └── productController.js  # Lógica CRUD + API externa
│   │   ├── middleware/
│   │   │   └── index.js      # Morgan logging, validación, error handler
│   │   ├── routes/
│   │   │   └── products.js   # Definición de rutas
│   │   ├── validators/
│   │   │   └── productValidator.js   # Esquemas Joi
│   │   └── index.js          # Entry point Express
│   ├── .env.example
│   └── package.json
├── frontend/                 # Next.js 14 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js       # Galería principal
│   │   │   ├── product/[id]/ # Detalle de producto
│   │   │   ├── admin/        # Panel CRUD
│   │   │   ├── layout.js
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ProductCard.js
│   │   │   └── SearchBar.js
│   │   └── lib/
│   │       └── api.js        # Funciones fetch hacia el backend
│   ├── .env.example
│   └── package.json
├── database/
│   └── schema.sql            # DDL + datos de ejemplo
├── backend/railway.toml      # Config de despliegue Railway (backend)
├── frontend/railway.toml     # Config de despliegue Railway (frontend)
└── README.md
```

---

## ⚙️ Instalación Local

### Prerequisitos
- Node.js ≥ 18
- MySQL 8.x corriendo en local

### 1. Clonar el repositorio
```bash
git clone https://github.com/NamiDev-79/arte-store.git
cd arte-store
```

### 2. Configurar la base de datos
```bash
mysql -u root -p < database/schema.sql
```

### 3. Configurar el Backend
```bash
cd backend
cp .env.example .env
# Edita .env con tus credenciales MySQL
npm install
npm run dev        # Corre en http://localhost:4000
```

**Variables de entorno (`backend/.env`):**
```env
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=arte_store
FRONTEND_URL=http://localhost:3000
```

### 4. Configurar el Frontend
```bash
cd ../frontend
cp .env.example .env.local
# Asegúrate de que NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev        # Corre en http://localhost:3000
```

---

## 📡 Endpoints de la API

Base URL: `https://arte-store-backend.up.railway.app`

### `GET /health`
Verificar estado del servidor.
```bash
curl https://arte-store-backend.up.railway.app/health
```
```json
{ "status": "ok", "timestamp": "2024-01-15T10:30:00.000Z", "service": "arte-store-api" }
```

---

### `GET /api/products`
Listar todos los productos. Soporta filtros opcionales.

**Query params:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `search` | string | Buscar en nombre y descripción |
| `category` | string | Filtrar por categoría exacta |
| `artist` | string | Filtrar por artista (LIKE) |
| `page` | number | Página (default: 1) |
| `limit` | number | Resultados por página (default: 20) |

```bash
# Todos los productos
curl https://arte-store-backend.up.railway.app/api/products

# Filtrar por categoría
curl "https://arte-store-backend.up.railway.app/api/products?category=Pintura"

# Buscar por texto
curl "https://arte-store-backend.up.railway.app/api/products?search=acuarela"

# Paginación
curl "https://arte-store-backend.up.railway.app/api/products?page=2&limit=5"
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Óleo sobre lienzo – Atardecer",
      "description": "Pintura al óleo de gran formato...",
      "price": "1200.00",
      "stock": 1,
      "image_url": "https://picsum.photos/seed/oleo/600/400",
      "category": "Pintura",
      "artist": "María Torres",
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### `GET /api/products/:id`
Obtener un producto por ID.

```bash
curl https://arte-store-backend.up.railway.app/api/products/1
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": { "id": 1, "name": "Óleo sobre lienzo – Atardecer", ... }
}
```

**Producto no encontrado (404):**
```json
{ "success": false, "message": "Producto no encontrado" }
```

---

### `POST /api/products`
Crear un nuevo producto. **La imagen se obtiene automáticamente de Lorem Picsum.**

```bash
curl -X POST https://arte-store-backend.up.railway.app/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acuarela – Mar en calma",
    "description": "Obra de técnica mixta sobre papel de algodón de 300 g.",
    "price": 780.00,
    "stock": 3,
    "category": "Acuarela",
    "artist": "Elena Ríos"
  }'
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id": 6,
    "name": "Acuarela – Mar en calma",
    "price": "780.00",
    "stock": 3,
    "image_url": "https://picsum.photos/seed/acuarela-mar-en-calma/600/400",
    "category": "Acuarela",
    "artist": "Elena Ríos",
    ...
  }
}
```

**Validación fallida (400):**
```json
{
  "success": false,
  "message": "Datos inválidos",
  "errors": ["El precio debe ser mayor a 0", "El stock es obligatorio"]
}
```

---

### `PUT /api/products/:id`
Actualizar un producto existente. Solo los campos enviados serán modificados.

```bash
curl -X PUT https://arte-store-backend.up.railway.app/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{ "price": 1350.00, "stock": 2 }'
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Producto actualizado",
  "data": { "id": 1, "price": "1350.00", "stock": 2, ... }
}
```

---

### `DELETE /api/products/:id`
Eliminar un producto.

```bash
curl -X DELETE https://arte-store-backend.up.railway.app/api/products/6
```

**Respuesta (200):**
```json
{ "success": true, "message": "Producto eliminado correctamente" }
```

---

### `GET /api/products/categories`
Listar todas las categorías disponibles.

```bash
curl https://arte-store-backend.up.railway.app/api/products/categories
```
```json
{ "success": true, "data": ["Acuarela", "Cerámica", "Escultura", "Fotografía", "Pintura"] }
```

---

## 🌐 Consumo de API Externa

Al crear un producto (`POST /api/products`), el backend consulta automáticamente **[Lorem Picsum](https://picsum.photos/)** para asignar una imagen:

```
https://picsum.photos/seed/{nombre-producto-slugificado}/600/400
```

- La semilla se deriva del nombre del producto, por lo que la imagen es **determinista y consistente**.
- Si la API externa falla, se usa una imagen aleatoria de respaldo.
- El campo `image_url` también puede actualizarse manualmente con `PUT /api/products/:id`.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Backend | Node.js, Express.js 4 |
| Base de datos | MySQL 8 + mysql2 (pool de conexiones) |
| Validación | Joi |
| Logging | Morgan |
| API externa | Lorem Picsum (`picsum.photos`) |
| Frontend | Next.js 14 (App Router) |
| Estilos | CSS-in-JS (inline styles con CSS variables) |
| Fuentes | Cormorant Garamond + DM Mono (Google Fonts) |
| Despliegue | Railway.app |

---
