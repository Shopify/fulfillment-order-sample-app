import { Card, Button, IndexTable } from '@shopify/polaris';
import { gql, useMutation } from '@apollo/client';

export function FulfillmentOrderList({ fulfillmentOrders }) {
  const FULFILLMENT_CREATE_MUTATION = gql`
    mutation fulfillmentCreateV2($fulfillment: FulfillmentV2Input!) {
      fulfillmentCreateV2(fulfillment: $fulfillment) {
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

  const [createFulfillmentMutation] = useMutation(FULFILLMENT_CREATE_MUTATION);

  const rowMarkup = fulfillmentOrders.map(
    ({ id, assignedLocation, order, merchantRequests }, index) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>ID:{id}</IndexTable.Cell>
        <IndexTable.Cell>Order:{order.id}</IndexTable.Cell>
        <IndexTable.Cell>Location: {assignedLocation.name}</IndexTable.Cell>
        <IndexTable.Cell>
          <Button
            onClick={async () => {
              const result = await createFulfillmentMutation({
                variables: {
                  fulfillment: {
                    lineItemsByFulfillmentOrder: [
                      {
                        fulfillmentOrderId: id,
                      },
                    ],
                  },
                },
              });
              console.log('result', result);
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
      <IndexTable
        resourceName={{
          singular: 'Fulfillment Order',
          plural: 'Fulfillment Orders',
        }}
        itemCount={Object.keys(fulfillmentOrders).length}
        headings={[
          { title: 'Fulfillment Order ID' },
          { title: 'Order ID' },
          { title: 'Location' },
          { title: 'Fulfill Now' },
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </Card>
  );
}
