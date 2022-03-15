import {
  Card,
  Button,
  IndexTable,
  Toast,
  useIndexResourceState,
} from '@shopify/polaris';
import { useFulfillmentCreateV2 } from '../hooks/useFulfillmentCreateV2';
import { useState } from 'react';

export function FulfillmentOrderList({ fulfillmentOrders }) {
  const { createFulfillment } = useFulfillmentCreateV2();
  const [fulfillmentOrdersState, setFulfillmentOrdersState] =
    useState(fulfillmentOrders);
  const [showError, setShowError] = useState(false);
  const { selectedResources, handleSelectionChange } = useIndexResourceState(
    fulfillmentOrdersState
  );

  const removeFulfillmentItemFromList = (idsToRemove) => {
    setFulfillmentOrdersState((prev) => {
      const itemsNotFulfilled = prev.filter(
        (order) => !idsToRemove.includes(order.id)
      );
      return itemsNotFulfilled;
    });
  };

  const fulfillItems = async (ids) => {
    const result = await createFulfillment(ids);
    if (result.data.fulfillmentCreateV2?.userErrors.length) {
      setShowError(true);
      return;
    }
    removeFulfillmentItemFromList(ids);
  };

  const fulfillmentOrderListItems = fulfillmentOrdersState.map(
    ({ id, assignedLocation, order }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        position={index}
        selected={selectedResources.includes(id)}
      >
        <IndexTable.Cell>{id}</IndexTable.Cell>
        <IndexTable.Cell>{order.id}</IndexTable.Cell>
        <IndexTable.Cell>{assignedLocation.name}</IndexTable.Cell>
        <IndexTable.Cell>
          <Button onClick={() => fulfillItems([id])}>Fulfill</Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <>
      {showError && (
        <>
          test
          <Toast
            content="Error - not able to perform mutation"
            error
            onDismiss={() => setShowError(false)}
          />
        </>
      )}
      <Card>
        <IndexTable
          resourceName={{
            singular: 'Fulfillment Order',
            plural: 'Fulfillment Orders',
          }}
          itemCount={Object.keys(fulfillmentOrdersState).length}
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: 'Fulfillment Order ID' },
            { title: 'Order ID' },
            { title: 'Location' },
            { title: 'Fulfill Now' },
          ]}
        >
          {fulfillmentOrderListItems}
        </IndexTable>
        {/*
         We can decide to keep this or not - you cant fulfill across multiple orders so need to update hook
        {selectedResources.length > 0 && (
          <Button
            primary
            onClick={() => {
              fulfillItems(selectedResources);
            }}
          >
            Fulfill {selectedResources.length} items
          </Button>
        )} */}
      </Card>
    </>
  );
}
