import {
  Card,
  Button,
  IndexTable,
  useIndexResourceState,
  Modal,
  TextField,
} from '@shopify/polaris';
import { useFulfillmentCreateV2 } from '../hooks/useFulfillmentCreateV2';
import { useState } from 'react';
import { Toast } from '@shopify/app-bridge-react';

export function FulfillmentOrderList({ fulfillmentOrders }) {
  const { createFulfillment } = useFulfillmentCreateV2();
  const [fulfillmentOrdersState, setFulfillmentOrdersState] =
    useState(fulfillmentOrders);
  const [showError, setShowError] = useState(false);
  const { selectedResources, handleSelectionChange } = useIndexResourceState(
    fulfillmentOrdersState
  );
  const [modalState, setModalState] = useState({
    open: false,
    fulfillmentId: null,
  });
  const [message, setMessage] = useState('');
  const removeFulfillmentItemFromList = (idsToRemove) => {
    setFulfillmentOrdersState((prev) => {
      const itemsNotFulfilled = prev.filter(
        (order) => !idsToRemove.includes(order.id)
      );
      return itemsNotFulfilled;
    });
  };

  const fulfillItems = async (id) => {
    const result = await createFulfillment(id);
    if (result.data.fulfillmentCreateV2?.userErrors.length) {
      setShowError(true);
      return;
    }
    removeFulfillmentItemFromList(id);
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
          <Button
            id={id}
            onClick={() => setModalState({ open: true, fulfillmentId: id })}
          >
            Add Message
          </Button>
        </IndexTable.Cell>
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
      <Modal
        title="Fulfillment Message"
        message="Write your message plz"
        open={modalState.open}
        onClose={() => setModalState({ ...modalState, open: false })}
        primaryAction={{
          content: 'Add Fulfillment',
          onAction: () => setModalState({ ...modalState, open: false }),
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setModalState({ ...modalState, open: false }),
          },
        ]}
      >
        <TextField
          label="Fulfillment Message"
          value={message}
          onChange={setMessage}
        />
      </Modal>
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
            { title: 'Fulfillment Message' },
            { title: 'Fulfill Now' },
          ]}
        >
          {fulfillmentOrderListItems}
        </IndexTable>

        {/* We can decide to keep this or not - you cant fulfill across multiple orders so need to update hook */}
        {/* {selectedResources.length > 0 && (
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
