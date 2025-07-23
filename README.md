# 🛍️ Orders Remix Shopify App

A **Shopify embedded app** built with **Remix**. It receives **new order webhooks**, stores them in a **Prisma/SQLite** database, and displays a **paginated admin table** using **Shopify Polaris**.

This README includes both local testing and full Shopify cloud/tunnel/webhook usage instructions as used in real-world developer and assignment scenarios.

---

## ✨ Features

- 🔔 **Shopify Webhook Integration**: Subscribes automatically to `orders/create` and other Shopify topics.
- 💾 **Database Integration**: Persists order details in a relational store via **Prisma/SQLite**.
- 🧭 **Embedded Admin UI**: Paginated (5 per page) Polaris table, embedded inside Shopify Admin.
- 🌐 **Tunnel-Ready**: Works with Shopify Local Tunnel (e.g., Cloudflare) to receive live Shopify webhooks securely.
- 🧪 **Local + Cloud Testing**: Test with Postman/curl or live Shopify test orders.

---

## ✅ Prerequisites

- [Node.js (LTS)](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Shopify Partner account](https://partners.shopify.com/)
- Shopify CLI  
  ```bash
  npm install -g @shopify/cli @shopify/app

⚙️ Setup Instructions
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/<your-github-username>/orders-remix-app.git
cd orders-remix-app
2. Install Dependencies
bash
Copy
Edit
npm install
3. Initialize the Database
bash
Copy
Edit
npx prisma migrate dev --name init
💡 Optional: Use npx prisma studio to visually inspect/edit the database.

🚀 Running the App (with Cloud Tunnel)
Shopify CLI uses a random port each time — check the terminal!

1. Start Development Server
bash
Copy
Edit
npm run dev
Watch for terminal output like:

ruby
Copy
Edit
Local:   http://localhost:49201/
Preview: https://your-store.myshopify.com/admin/apps/your-app
2. Expose Your App with Cloudflare Tunnel
Replace 49201 with the actual port from above:

bash
Copy
Edit
npx cloudflared tunnel --url http://localhost:49201
3. Update shopify.app.toml
toml
Copy
Edit
application_url = "https://your-tunnel-url/"
[auth]
redirect_urls = ["https://your-tunnel-url/api/auth"]

[webhooks]
api_version = "2025-07"

  [[webhooks.subscriptions]]
  topics = ["orders/create"]
  uri    = "/webhooks/orders_create"
📦 Receiving and Testing Webhooks
A. Local Testing (Postman or curl)
URL: http://localhost:<port>/webhooks/orders_create

Method: POST

Payload:

json
Copy
Edit
{
  "id": "9876543210",
  "total_price": "123.45",
  "created_at": "2024-07-01T14:30:00Z",
  "customer": {
    "first_name": "John",
    "last_name": "Doe"
  }
}
Expected response:

json
Copy
Edit
{ "success": true }
B. Live Shopify Order Testing (Tunnel Required)
Install the app in your Shopify dev store.

Open it from Shopify Admin → Apps.

Create a test order.

Shopify sends a POST to your public webhook URL.

Visit /orders to view admin UI and confirm it's saved.

⚠️ Shopify cannot send webhooks to localhost — use a public tunnel!

🧮 Viewing the Admin Table
In Shopify Admin:

Go to Apps → Orders Remix App

See the embedded UI with 5 orders per page

Use Next / Previous buttons to navigate

📁 Project Structure
pgsql
Copy
Edit
app/
  routes/
    webhooks.orders_create.jsx   # Webhook handler (POST)
    orders.jsx                   # Admin UI with Polaris
  db.server.js                   # Prisma client
  shopify.server.js              # Shopify API/session config

prisma/
  schema.prisma                  # DB schema (Order, Session)

shopify.app.toml                 # App config
package.json
🛠️ Troubleshooting
Always use the exact port/tunnel URL shown in terminal.

If error: Cannot find module '~/db.server' → change to:

js
Copy
Edit
import prisma from "../db.server"
Shopify webhooks must use public HTTPS tunnel (e.g., Cloudflare/Ngrok).

Polaris styles must be imported in app/root.jsx:

js
Copy
Edit
import '@shopify/polaris/build/esm/styles.css';
Wrap your app in AppProvider:

js
Copy
Edit
<AppProvider i18n={{}}>
  {/* your app */}
</AppProvider>
📚 References
Shopify Remix Webhooks Documentation

Using Cloudflare/Ngrok with Shopify CLI

Shopify Polaris UI