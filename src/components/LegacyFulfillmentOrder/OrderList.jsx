import { Button, Card, IndexTable } from '@shopify/polaris';
import { userLoggedInFetch } from '../../App';
import { useAppBridge, Toast } from '@shopify/app-bridge-react';
import { useState } from 'react';

export function OrderList({ orders }) {
  const app = useAppBridge();

  const [showMessage, setShowMessage] = useState({
    message: '',
    show: false,
    error: false,
  });

  const fulfillOrders = async (id) => {
    const authFetch = userLoggedInFetch(app);
    const res = await authFetch(
      `/orders/${id}?shop=megans-very-cool-store.myshopify.com/`,
      {
        method: 'POST',
        body: JSON.stringify({ fulfillment: { location_id: 67847880927 } }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (res.status === 200) {
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

  function isOrderFulfillable(line_items) {
    const fulfillableLineItems = line_items.filter(
      (item) => item.fulfillable_quantity >= 1
    );
    if (fulfillableLineItems.length === line_items.length) {
      return true;
    }
  }

  const orderListItems = orders.map(
    ({ id, line_items }, index) =>
      isOrderFulfillable(line_items) && (
        <IndexTable.Row id={id} key={index} index={index} selected={false}>
          <IndexTable.Cell>{id}</IndexTable.Cell>
          <IndexTable.Cell>a message</IndexTable.Cell>
          <IndexTable.Cell>
            <Button onClick={() => fulfillOrders(id)}>Fulfill</Button>
          </IndexTable.Cell>
        </IndexTable.Row>
      )
  );
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
          headings={[
            { title: 'Order ID' },
            { title: 'Fulfillment Message' },
            { title: 'Fulfill Now' },
          ]}
        >
          {orderListItems}
        </IndexTable>
      </Card>
    </>
  );
}
