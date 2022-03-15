import { Card, Button, IndexTable, Toast } from '@shopify/polaris';
import { useFulfillmentCreateV2 } from '../hooks/useFulfillmentCreateV2';
import { useState } from 'react';

export function FulfillmentOrderList({ fulfillmentOrders }) {
  const { createFulfillment } = useFulfillmentCreateV2();
  const [fulfillmentOrdersState, setFulfillmentOrdersState] =
    useState(fulfillmentOrders);
  const [showError, setShowError] = useState(false);

  const removeFulfillmentItemFromList = (id) => {
    setFulfillmentOrdersState((prev) => {
      const itemToRemove = prev.findIndex((order) => order.id === id);
      const newItems = [...prev];
      newItems.splice(itemToRemove, 1);
      return newItems;
    });
  };
  const fulfillmentOrderListItems = fulfillmentOrdersState.map(
    ({ id, assignedLocation, order }, index) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>{id}</IndexTable.Cell>
        <IndexTable.Cell>{order.id}</IndexTable.Cell>
        <IndexTable.Cell>{assignedLocation.name}</IndexTable.Cell>
        <IndexTable.Cell>
          <Button
            onClick={async () => {
              const result = await createFulfillment(id);
              if (result.data?.useFulfillmentCreateV2?.userErrors.length) {
                showError(true);
              }
              console.log('result', result);
              removeFulfillmentItemFromList(id);
            }}
          >
            Fulfill
          </Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Card>
      <Toast
        content="Error - not able to perform mutation"
        error
        onDismiss={() => setShowError(false)}
      />
      <IndexTable
        resourceName={{
          singular: 'Fulfillment Order',
          plural: 'Fulfillment Orders',
        }}
        itemCount={Object.keys(fulfillmentOrdersState).length}
        headings={[
          { title: 'Fulfillment Order ID' },
          { title: 'Order ID' },
          { title: 'Location' },
          { title: 'Fulfill Now' },
        ]}
      >
        {fulfillmentOrderListItems}
      </IndexTable>
    </Card>
  );
}
