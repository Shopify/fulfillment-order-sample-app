import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { FULFILLMENT_CREATE_MUTATION } from '../components/NewFulfillmentOrder/FulfillmentOrderList';

export const useFulfillmentCreateV2 = () => {
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
