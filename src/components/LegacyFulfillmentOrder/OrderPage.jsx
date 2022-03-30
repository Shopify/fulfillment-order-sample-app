import { useEffect, useState } from 'react';
import { userLoggedInFetch } from '../../App';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Card, Layout } from '@shopify/polaris';
import { OrderList } from './OrderList';

export function OrderPage() {
  const [orders, setOrders] = useState();
  const app = useAppBridge();
  useEffect(async () => {
    const authFetch = userLoggedInFetch(app);
    const res = await authFetch('/orders');
    if (res.ok) {
      const resJson = await res.json();

      const fulfillableOrders = resJson.body.orders.filter(
        ({ line_items }) => isOrderFulfillable(line_items) === true
      );
      setOrders(fulfillableOrders);
    }
  }, []);

  function isOrderFulfillable(line_items) {
    const fulfillableLineItems = line_items.filter(
      ({ fulfillable_quantity }) => fulfillable_quantity >= 1
    );
    if (fulfillableLineItems.length === line_items.length) return true;
    else return false;
  }

  function removeOrder(orderToRemoveId) {
    setOrders(orders.filter(({ id: orderId }) => orderId !== orderToRemoveId));
  }

  return (
    <Layout.Section>
      <Card>
        {orders && (
          <OrderList orders={orders} setOrdersCallback={removeOrder} />
        )}
      </Card>
    </Layout.Section>
  );
}
