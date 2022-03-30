import { Button, Card, IndexTable } from '@shopify/polaris';
import { userLoggedInFetch } from '../../App';
import { useAppBridge, Toast } from '@shopify/app-bridge-react';
import { useState } from 'react';

export function OrderList({ orders, setOrdersCallback }) {
  const [showMessage, setShowMessage] = useState({
    message: '',
    show: false,
    error: false,
  });
  const app = useAppBridge();
  const fulfillOrders = async (id) => {
    const authFetch = userLoggedInFetch(app);
    const res = await authFetch(`/orders/${id}`, {
      method: 'POST',
      body: JSON.stringify({ fulfillment: { location_id: 67847880927 } }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.status === 200) {
      setOrdersCallback(id);
      setShowMessage({
        message: 'Order was fulfilled successfully',
        show: true,
        error: false,
      });
    } else {
      const jsonData = await res.json();
      setShowMessage({
        message: jsonData.message,
        show: true,
        error: true,
      });
    }
  };

  const orderListItems = orders.map(({ id }, index) => (
    <IndexTable.Row id={id} key={index} index={index} selected={false}>
      <IndexTable.Cell>{id}</IndexTable.Cell>
      <IndexTable.Cell>
        <Button onClick={() => fulfillOrders(id)}>Fulfill</Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));
  return (
    <>
      {showMessage.show && (
        <Toast
          content={showMessage.message}
          error={showMessage.error}
          onDismiss={() =>
            setShowMessage({ message: '', show: false, error: false })
          }
        />
      )}

      <Card>
        <IndexTable
          resourceName={{ singular: 'order', plural: 'orders' }}
          itemCount={orders.length}
          onSelectionChange={() => {}}
          headings={[{ title: 'Order ID' }, { title: 'Fulfill Now' }]}
        >
          {orderListItems}
        </IndexTable>
      </Card>
    </>
  );
}
