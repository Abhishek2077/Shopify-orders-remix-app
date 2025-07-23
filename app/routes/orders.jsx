import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import prisma from "../db.server"; // Use relative path!

import { Page, Card, IndexTable, Text } from '@shopify/polaris';

// --- Loader function fetches current page of orders from DB ---
export async function loader({ request }) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const PAGE_SIZE = 5;
  const skip = (page - 1) * PAGE_SIZE;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      orderBy: { order_date: 'desc' },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.order.count(),
  ]);

  return json({ orders, page, total, pageCount: Math.ceil(total / PAGE_SIZE) });
}

// --- Main Admin Table Page ---
export default function OrdersRoute() {
  const { orders, page, total, pageCount } = useLoaderData();
  const [params] = useSearchParams();
  const currentPage = Number(params.get("page") || 1);

  const resourceName = { singular: "order", plural: "orders" };

  return (
    <Page title="Orders">
      <Card>
        <IndexTable
          resourceName={resourceName}
          itemCount={orders.length}
          headings={[
            { title: "Order ID" },
            { title: "Customer Name" },
            { title: "Total Price" },
            { title: "Order Date" },
          ]}
          selectable={false}
        >
          {orders.map((order, i) => (
            <IndexTable.Row id={order.id.toString()} key={order.id} position={i}>
              <IndexTable.Cell>{order.order_id}</IndexTable.Cell>
              <IndexTable.Cell>{order.customer_name}</IndexTable.Cell>
              <IndexTable.Cell>{order.total_price}</IndexTable.Cell>
              <IndexTable.Cell>
                <Text variant="bodySm">
                  {new Date(order.order_date).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </Text>
              </IndexTable.Cell>
            </IndexTable.Row>
          ))}
        </IndexTable>
        {/* --- Pagination Controls --- */}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button disabled={currentPage === 1} onClick={() => {
            window.location.search = `?page=${currentPage - 1}`;
          }}>Previous</button>
          <span>Page {currentPage} of {pageCount}</span>
          <button disabled={currentPage === pageCount} onClick={() => {
            window.location.search = `?page=${currentPage + 1}`;
          }}>Next</button>
        </div>
      </Card>
    </Page>
  );
}
