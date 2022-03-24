import { useEffect, useState } from 'react';
import { userLoggedInFetch } from '../../App';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Card, Layout } from '@shopify/polaris';
import { OrderList } from './OrderList';

export function OrderPage() {
  const [orders, setOrders] = useState();
  const app = useAppBridge();

  useEffect(async () => {
    /// data loading
    const authFetch = userLoggedInFetch(app);
    const res = await authFetch(
      '/orders?shop=megans-very-cool-store.myshopify.com/'
    );
    const resJson = await res.json();
    if (resJson) {
      setOrders(resJson.body.orders);
    }
  }, []);

  return (
    <Layout.Section>
      <Card>{orders && <OrderList orders={orders} />}</Card>
    </Layout.Section>
  );
}
