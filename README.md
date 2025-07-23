Orders Remix Shopify App
A Shopify embedded app built with Remix. Receives new order webhooks, stores them in a Prisma/SQLite database, and displays a paginated admin table using Shopify Polaris. This README includes both local testing and complete Shopify cloud/tunnel/webhook usage as seen in full developer and assignment scenarios.

Features
Shopify Webhook Integration: Subscribes automatically to orders/create and other Shopify topics.

Database Integration: Persists order details in a relational store via Prisma/SQLite.

Embedded Admin UI: Paginated (5 per page) Polaris table, native to Shopify Admin.

Works with Shopify Local Tunnel (e.g. Cloudflare): Receive live Shopify webhooks via a public HTTPS endpoint, not just locally.

Easy Local/Cloud Testing: Supports both direct Postman/curl tests and live Shopify test orders through secure tunnels.

Prerequisites
NodeJS (LTS recommended)

Git

Shopify Partner account with a development store

Shopify CLI (npm install -g @shopify/cli @shopify/app)

Setup Instructions
1. Clone the Repository
bash
git clone https://github.com/<your-github-username>/orders-remix-app.git
cd orders-remix-app
2. Install Dependencies
bash
npm install
3. Initialize the Database
bash
npx prisma migrate dev --name init
(Optional: Run npx prisma studio to inspect/edit the database visually.)

Running the App (with Shopify Cloud Tunnel for Live Webhooks)
Shopify CLI dev servers use a random port each run. Always note the local URL shown after starting the server.

1. Start Development Server
bash
npm run dev
Watch for output:

Local: http://localhost:XXXXX/

Preview: https://your-store.myshopify.com/admin/apps/your-app

2. Expose your local app to Shopify with Cloudflare Tunnel
Shopify CLI uses Cloudflare Quick Tunnels by default for secure dev URLs. This allows Shopify to send webhooks/events directly to your local app.

If you ever need to start your own tunnel or test with Cloudflare manually, you can use:

bash
npx cloudflared tunnel --url http://localhost:XXXXX
(Replace with your dev server's port.)

Once running, update your Shopify app config:

Set application_url and [auth] redirect_urls in shopify.app.toml to match the public tunnel endpoint Shopify will use (example: https://randomstring.trycloudflare.com/).

3. Shopify App Configuration (shopify.app.toml)
text
application_url = "https://your-tunnel-url/"
[auth]
redirect_urls = ["https://your-tunnel-url/api/auth"]
[webhooks]
api_version = "2025-07"
  [[webhooks.subscriptions]]
  topics = ["orders/create"]
  uri    = "/webhooks/orders_create"
Receiving and Testing Webhooks
A. Test with Postman/Curl (Local Only)
Get the current local server URL/port from your dev terminal.

Make a POST request to /webhooks/orders_create:

Example URL: http://localhost:49201/webhooks/orders_create

Use this JSON as sample payload:

json
{
  "id": "9876543210",
  "total_price": "123.45",
  "created_at": "2024-07-01T14:30:00Z",
  "customer": {
    "first_name": "John",
    "last_name": "Doe"
  }
}
You should get { "success": true } on success.

B. Test with Live Shopify Orders (Cloudflare/Ngrok Tunnel Required)
Ensure the app is installed in your Shopify dev store.

Open the app from Shopify Admin → Apps.

Create a test order.

Shopify will POST to your public webhook URL (as configured).

Open the admin panel (/orders) to confirm the new order is displayed.

Important: Shopify cannot deliver live webhooks to localhost—it needs a public HTTPS domain from a tunnel service.

Viewing the Admin Table
In Shopify Admin, go to Apps > Orders Remix App.

The embedded UI lists orders with pagination (5 per page).

Use Next/Previous navigation to change pages.

Project Structure
text
app/
  routes/
    webhooks.orders_create.jsx   # Webhook handler (POST)
    orders.jsx                   # Admin UI with Polaris and pagination
  db.server.js                   # Prisma client instance (import with relative path)
  shopify.server.js              # Shopify API/session config (import with relative path)
prisma/
  schema.prisma                  # Prisma DB schema (Order, Session)
shopify.app.toml                 # Shopify CLI app configuration file
package.json
Troubleshooting & References
Always use the current port/tunnel URL shown in your terminal.

If you see "Cannot find module '~/db.server'", use relative imports like import prisma from "../db.server" in route files.

Shopify webhooks can only be delivered to public HTTPS URLs; use Cloudflare/Ngrok tunnels for end-to-end testing.

Polaris CSS must be imported at the top of app/root.jsx:

js
import '@shopify/polaris/build/esm/styles.css';
The app must be wrapped in <AppProvider i18n={{}}>...</AppProvider> for Polaris UI to render without errors.


References
Shopify Remix webhooks docs

How to run Shopify apps with Cloudflare/Ngrok tunnels for live webhook testing

Webhook creation and security topics
