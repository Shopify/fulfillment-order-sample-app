import { useCallback } from 'react';
import { gql, useMutation } from '@apollo/client';

export const useFulfillmentCreateV2 = () => {
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
  const createFulfillment = useCallback(
    async (id) => {
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
      return result;
    },
    [createFulfillmentMutation]
  );
  return { createFulfillment };
};
