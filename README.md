# Om Mosquito Nets — E-commerce Platform

Premium e-commerce web application for **Om Mosquito Nets**, a mosquito net and curtain retailer in Chennai.

## Tech Stack

- **Next.js 16** (App Router, JavaScript)
- **Tailwind CSS v4** (utility classes only)
- **Supabase** (Auth, Postgres, Storage)
- **Zustand** (cart state)
- **Lucide React** (icons)
- **Framer Motion** (available for animations)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.local.example` to `.env.local` and fill in your keys:

```bash
cp .env.local.example .env.local
```

3. Run the SQL migration in Supabase SQL Editor:
   - Open `supabase/migrations/001_initial_schema.sql`
   - Paste and execute in Supabase Dashboard → SQL Editor

4. Create a Storage bucket:
   - Supabase Dashboard → Storage → New bucket
   - Name: `product-images`, set to **Public**

5. Promote your first admin user (after registering):
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_UUID';
   ```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, categories, featured products, testimonials |
| `/products` | Shop with filters, search, pagination |
| `/products/[slug]` | Product detail with gallery, variants, reviews |
| `/cart` | Shopping cart |
| `/checkout` | Checkout (requires login) |
| `/auth` | Login / Register |
| `/account` | User profile & order history |
| `/about` | About the business |
| `/contact` | Contact info & map |
| `/admin` | Admin dashboard (admin role only) |
| `/admin/products` | Product CRUD |
| `/admin/categories` | Category CRUD |
| `/admin/attributes` | Attribute & value management |
| `/admin/orders` | Order management |
| `/admin/users` | User management |
| `/admin/whatsapp` | WhatsApp Business API config |

## WhatsApp Notifications

Automated WhatsApp messages are sent via **Meta WhatsApp Business Cloud API**:

- **Welcome message** — when a customer registers (requires phone number)
- **Order confirmation** — sent to customer on order placement
- **Admin alert** — sent to admin phone on every new order

Configure at `/admin/whatsapp`:
1. Set up WhatsApp Business API in [Meta Developer Console](https://developers.facebook.com)
2. Enter API Token and Phone Number ID
3. Save & send a test message

## Security

- Row Level Security (RLS) on all Supabase tables
- Middleware protects `/admin/*`, `/account`, `/checkout`
- Admin routes require `role = 'admin'` in profiles
- Service role key used only in server-side API routes

## Project Structure

```
app/                  # Pages & API routes
components/
  ui/                 # Reusable UI components
  layout/             # Header, Footer, AdminSidebar
  products/           # Product-specific components
context/              # AuthProvider
store/                # Zustand cart store
lib/                  # Supabase clients, utils, WhatsApp
supabase/migrations/  # Database schema & seed data
```

## Business Info

- **Phone:** 090642 44204
- **Address:** No.155, 5th St, Kamadhenu Nagar, Thiruverkadu, Chennai 600077
- **Instagram:** [@ommosquitonets](https://instagram.com/ommosquitonets)
