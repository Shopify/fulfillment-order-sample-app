import { Card, Button, IndexTable } from '@shopify/polaris';
import { useState } from 'react';
import { Toast } from '@shopify/app-bridge-react';
import FulfillmentMessageModal from './FulfillmentMessageModal';
import { gql, useMutation } from '@apollo/client';
/*
 * This mutation is used to fulfill a fulfillmentOrder, and adds a fulfillment message if applicable.
 */
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

  // store the fulfillmentOrders in state so when they are fulfilled they can be removed from the view.
  const [fulfillmentOrdersState, setFulfillmentOrdersState] =
    useState(fulfillmentOrders);

  const removeFulfillmentItemFromList = (idsToRemove) => {
    setFulfillmentOrdersState((prev) => {
      const itemsNotFulfilled = prev.filter(
        (fulfillmentOrder) => !idsToRemove.includes(fulfillmentOrder.id)
      );
      return itemsNotFulfilled;
    });
  };

  const [modalState, setModalState] = useState({
    open: false,
    fulfillmentId: null,
    message: '',
  });

  const fulfillItems = async (id) => {
    // if a message as been added from the modal, we need to pass it to the mutation.
    let message = '';
    if (modalState.fulfillmentId === id) {
      message = modalState.message;
    }
    // the following performs the mutation to fulfill the fulfillment order.
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
    if (data) {
      removeFulfillmentItemFromList(id);
      console.log('Fulfilled Fulfillment Order: ', data);
    }
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
