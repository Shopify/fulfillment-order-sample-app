import { Button } from '@shopify/polaris';
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
  return (
    <>
      {fulfillmentOrders.map(({ id }) => {
        return (
          <>
            <p>{id}</p>
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
          </>
        );
      })}
    </>
  );
}
