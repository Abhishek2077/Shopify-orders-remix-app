import { json } from "@remix-run/node";
import prisma from "../db.server";

export async function action({ request }) {
  // For local testing, skip webhook verification
  const rawBody = await request.text();

  // Parse webhook payload
  const payload = JSON.parse(rawBody);

  // Extract order details
  const orderId = payload.id?.toString();
  const customerName =
    payload.customer?.first_name && payload.customer?.last_name
      ? `${payload.customer.first_name} ${payload.customer.last_name}`
      : "Unknown";
  const totalPrice = payload.total_price?.toString() || "0";
  const orderDate = payload.created_at
    ? new Date(payload.created_at)
    : new Date();

  // Save order to database
  try {
    await prisma.order.create({
      data: {
        order_id: orderId,
        customer_name: customerName,
        total_price: totalPrice,
        order_date: orderDate,
      },
    });
    return json({ success: true });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export function loader() {
  throw new Response(null, { status: 404 });
}