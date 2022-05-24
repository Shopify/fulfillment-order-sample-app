import { Button, Card, IndexTable } from '@shopify/polaris';
import { userLoggedInFetch } from '../../App';
import { useAppBridge, Toast } from '@shopify/app-bridge-react';
import FulfillmentMessageModal from '../NewFulfillmentOrder/FulfillmentMessageModal';
import { useEffect, useState } from 'react';

export function OrderList({ orders, setOrdersCallback }) {
  const app = useAppBridge();
  const authFetch = userLoggedInFetch(app);
  const [location, setLocation] = useState('');

  useEffect(async () => {
    const res = await authFetch('/location', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      const jsonData = await res.json();
      setLocation(jsonData.id);
    } else {
      console.log(`Problem fetching location data: ${res.statusText}`);
    }
  }, []);

  const [showMessage, setShowMessage] = useState({
    message: '',
    show: false,
    error: false,
  });

  const [modalState, setModalState] = useState({
    open: false,
    fulfillmentId: null,
    message: '',
  });

  function createRequestBody() {
    if (modalState.message) {
      return JSON.stringify({
        fulfillment: { location_id: location },
        order: { note: modalState.message },
      });
    } else {
      return JSON.stringify({
        fulfillment: { location_id: location },
      });
    }
  }

  //Makes API call to the server to fulfill an order specified by the id, using /orders/id/fulfillment endpoint
  const fulfillOrders = async (id) => {
    const res = await authFetch(`/orders/${id}`, {
      method: 'POST',
      body: createRequestBody(),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      //If the order was fulfilled successfully, calls the parent component to remove the order from the list of orders to be fulfilled
      setOrdersCallback(id);

      setShowMessage({
        message: `Order was fulfilled successfully ${
          modalState.message ? `with message: ${modalState.message}` : ''
        }`,
        show: true,
        error: false,
      });

      //reset the state of the message modal
      setModalState({ ...modalState, message: '' });
    } else {
      const jsonData = await res.json();
      setShowMessage({
        message: jsonData.message,
        show: true,
        error: true,
      });
      console.log('Fulfillment failed: ', jsonData);
    }
  };

  const orderListItems = orders.map(({ id }, index) => (
    <IndexTable.Row id={id} key={index} index={index} selected={false}>
      <IndexTable.Cell>{id}</IndexTable.Cell>
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
      <FulfillmentMessageModal
        open={modalState.open}
        saveMessage={(message) =>
          setModalState({ ...modalState, open: false, message })
        }
      />
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
