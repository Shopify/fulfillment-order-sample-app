import { Button, Card, IndexTable } from '@shopify/polaris';
import { userLoggedInFetch } from '../../App';
import { useAppBridge, Toast } from '@shopify/app-bridge-react';
import { useState } from 'react';

export function OrderList({ orders }) {
  console.log(orders);
  const app = useAppBridge();
  const [showError, setShowError] = useState(false);

  const fulfillOrders = async (id) => {
    const authFetch = userLoggedInFetch(app);
    authFetch(`/orders/${id}?shop=megans-very-cool-store.myshopify.com/`, {
      method: 'POST',
      body: JSON.stringify({ fulfillment: { location_id: 67847880927 } }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          setShowError(true);
        }
      })
      .catch((error) => {
        setShowError(true);
        console.log(error);
      });
  };

  function isOrderFulfillable(line_items) {
    const fulfillableLineItems = line_items.filter(
      (item) => item.fulfillable_quantity >= 1
    );
    if (fulfillableLineItems.length === line_items.length) {
      return true;
    }
  }

  const orderListItems = orders.map(({ id, line_items }, index) => (
    <>
      {isOrderFulfillable(line_items) && (
        <IndexTable.Row id={id} key={id} index={index} selected={false}>
          <IndexTable.Cell>{id}</IndexTable.Cell>
          <IndexTable.Cell>a message</IndexTable.Cell>
          <IndexTable.Cell>
            <Button onClick={() => fulfillOrders(id)}>Fulfill</Button>
          </IndexTable.Cell>
        </IndexTable.Row>
      )}
    </>
  ));
  return (
    <>
      {showError && (
        <Toast
          content="Error - Not able to fulfill order"
          error
          onDismiss={() => setShowError(false)}
        />
      )}

      <Card>
        <IndexTable
          resourceName={{ singular: 'order', plural: 'orders' }}
          itemCount={orders.length}
          onSelectionChange=""
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
