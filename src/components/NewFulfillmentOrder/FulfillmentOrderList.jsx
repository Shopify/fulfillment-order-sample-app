import { Card, Button, IndexTable } from '@shopify/polaris';
import { useState } from 'react';
import { Toast } from '@shopify/app-bridge-react';
import FulfillmentMessageModal from './FulfillmentMessageModal';
import { gql, useMutation } from '@apollo/client';
const FULFILLMENT_CREATE_MUTATION = gql`
  mutation fulfillmentCreateV2(
    $fulfillment: FulfillmentV2Input!
    $message: String
  ) {
    fulfillmentCreateV2(fulfillment: $fulfillment, message: $message) {
      fulfillment {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export function FulfillmentOrderList({ fulfillmentOrders }) {
  const [createFulfillment, { error }] = useMutation(
    FULFILLMENT_CREATE_MUTATION
  );
  const [fulfillmentOrdersState, setFulfillmentOrdersState] =
    useState(fulfillmentOrders);

  const [modalState, setModalState] = useState({
    open: false,
    fulfillmentId: null,
    message: '',
  });

  const removeFulfillmentItemFromList = (idsToRemove) => {
    setFulfillmentOrdersState((prev) => {
      const itemsNotFulfilled = prev.filter(
        (order) => !idsToRemove.includes(order.legacyResourceId)
      );
      return itemsNotFulfilled;
    });
  };

  const fulfillItems = async (id) => {
    let message = '';
    if (modalState.fulfillmentId === id) {
      message = modalState.message;
    }
    const { data } = await createFulfillment({
      variables: {
        fulfillment: {
          lineItemsByFulfillmentOrder: [
            {
              fulfillmentOrderId: id,
            },
          ],
        },
        message,
      },
    });
    if (data) removeFulfillmentItemFromList(id);
  };

  const fulfillmentOrderListItems = fulfillmentOrdersState.map(
    ({ id, assignedLocation, order }, index) => (
      <IndexTable.Row id={id} key={id} position={index} selected={false}>
        <IndexTable.Cell>{id}</IndexTable.Cell>
        <IndexTable.Cell>{order.legacyResourceId}</IndexTable.Cell>
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
      {error && (
        <>
          <Toast
            content="Error - not able to perform mutation"
            error
            onDismiss={() => {}}
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
          onSelectionChange={() => {}}
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
