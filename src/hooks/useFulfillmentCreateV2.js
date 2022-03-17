import { useCallback } from 'react';
import { gql, useMutation } from '@apollo/client';

export const useFulfillmentCreateV2 = () => {
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

  const [createFulfillmentMutation] = useMutation(FULFILLMENT_CREATE_MUTATION);
  const createFulfillment = useCallback(
    async ({ id, message }) => {
      const result = await createFulfillmentMutation({
        variables: {
          fulfillment: {
            lineItemsByFulfillmentOrder: [
              {
                fulfillmentOrderId: id,
              },
            ],
          },
          message: message,
        },
      });
      return result;
    },
    [createFulfillmentMutation]
  );
  return { createFulfillment };
};
