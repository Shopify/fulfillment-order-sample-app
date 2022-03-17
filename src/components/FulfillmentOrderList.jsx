import {
  Card,
  Button,
  IndexTable,
  useIndexResourceState,
} from '@shopify/polaris';
import { useFulfillmentCreateV2 } from '../hooks/useFulfillmentCreateV2';
import { useState } from 'react';
import { Toast } from '@shopify/app-bridge-react';
import FulfillmentMessageModal from './FulfillmentMessageModal';

export function FulfillmentOrderList({ fulfillmentOrders }) {
  const { createFulfillment } = useFulfillmentCreateV2();

  const [fulfillmentOrdersState, setFulfillmentOrdersState] =
    useState(fulfillmentOrders);

  const { selectedResources, handleSelectionChange } = useIndexResourceState(
    fulfillmentOrdersState
  );

  const [showError, setShowError] = useState(false);

  const [modalState, setModalState] = useState({
    open: false,
    fulfillmentId: null,
    message: '',
  });

  const removeFulfillmentItemFromList = (idsToRemove) => {
    setFulfillmentOrdersState((prev) => {
      const itemsNotFulfilled = prev.filter(
        (order) => !idsToRemove.includes(order.id)
      );
      return itemsNotFulfilled;
    });
  };

  const fulfillItems = async (id) => {
    let message = '';
    if (modalState.fulfillmentId === id) {
      message = modalState.message;
    }
    const result = await createFulfillment({
      id,
      message,
    });
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
          {modalState.fulfillmentId === id && modalState.message !== '' ? (
            <span> {modalState.message} </span>
          ) : (
            <Button
              onClick={() =>
                setModalState({ open: true, fulfillmentId: id, message: '' })
              }
            >
              Add Message
            </Button>
          )}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Button id={id} onClick={() => fulfillItems(id)}>
            Fulfill
          </Button>
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
      <FulfillmentMessageModal
        open={modalState.open}
        saveMessage={(message) =>
          setModalState({ ...modalState, open: false, message })
        }
      />
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
            { title: 'Fulfillment Location' },
            { title: 'Fulfillment Message' },
            { title: 'Fulfill Now' },
          ]}
        >
          {fulfillmentOrderListItems}
        </IndexTable>
      </Card>
    </>
  );
}
