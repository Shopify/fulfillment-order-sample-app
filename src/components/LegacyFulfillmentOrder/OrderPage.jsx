import { useEffect, useState } from 'react';
import { userLoggedInFetch } from '../../App';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Card, Layout } from '@shopify/polaris';
import { OrderList } from './OrderList';
/*
 * This component shows the legacy orders that need to be fulfilled.
 */
export function OrderPage() {
  const [orders, setOrders] = useState();

  function removeOrder(orderToRemoveId) {
    setOrders(orders.filter(({ id: orderId }) => orderId !== orderToRemoveId));
  }

  const app = useAppBridge();
  useEffect(async () => {
    // We need to be authenticated to make calls to the server.
    const authFetch = userLoggedInFetch(app);
    const res = await authFetch('/orders');
    if (res.ok) {
      const resJson = await res.json();
      console.log('Orders: ', resJson.body.orders);

      const fulfillableOrders = resJson.body.orders.filter(
        ({ line_items }) => isOrderFulfillable(line_items) === true
      );
      setOrders(fulfillableOrders);
    }
  }, []);

  // This function checks if the order is fulfillable. We defined fulfillable as having all line items with a fulfillable quantity > 0.
  function isOrderFulfillable(line_items) {
    const fulfillableLineItems = line_items.filter(
      ({ fulfillable_quantity }) => fulfillable_quantity > 0
    );
    if (fulfillableLineItems.length === line_items.length) return true;
    else return false;
  }

  return (
    <Layout.Section>
      <Card>
        {/* We pass in the orders to child component in order to display them in list view. */}
        {orders && (
          <OrderList orders={orders} setOrdersCallback={removeOrder} />
        )}
      </Card>
    </Layout.Section>
  );
}
