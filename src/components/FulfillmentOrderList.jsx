import { useMutation } from '@apollo/client';
import { Button } from '@shopify/polaris';

export function FulfillmentOrderList({ fulfillmentOrders }) {
  const fulfillmentV2Input = {
    lineItemsByFulfillmentOrder: fulfillmentOrders.lineItems.map((id) => id),
  };

  const FULFILLMENT_CREATE_MUTATION = gql`
    mutation {
      fulfillmentCreateV2(input: $input) {
        useErrors {
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
              onClick={() => {
                const result = createFulfillmentMutation({
                  variables: {
                    input: fulfillmentV2Input,
                  },
                });
                console.log(result);
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
