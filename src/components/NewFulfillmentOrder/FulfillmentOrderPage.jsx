import { gql, useQuery } from '@apollo/client';
import { Loading, useAppBridge } from '@shopify/app-bridge-react';
import { Banner, Card, Layout } from '@shopify/polaris';
import { userLoggedInFetch } from '../../App';
import { FulfillmentOrderList } from './FulfillmentOrderList';

/*
 * This component shows the fulfillment orders for the current shop.
 * This querys the shop to fetch the first 10 fulfillment orders.
 * We are returning the order object and the legacy resource id which maps to the REST order id.
 *
 * You could extract all the api logic to hooks for a production app, but we choose to keep everything in the same file for simplicity.
 */
const FULFILLMENT_ORDER_QUERY = gql`
  {
    shop {
      fulfillmentOrders(first: 10) {
        edges {
          node {
            id
            order {
              legacyResourceId
            }
            assignedLocation {
              name
            }
          }
        }
      }
    }
  }
`;

export function FulfillmentOrdersPage() {
  const { loading, error, data } = useQuery(FULFILLMENT_ORDER_QUERY);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    console.log('Error when retrieving fulfillment orders: ', error);
    return (
      <Banner status="critical">
        There was an issue loading FulfillmentOrders.
      </Banner>
    );
  }
  return (
    console.log('FulfillmentOrders: ', data),
    (
      <Layout.Section>
        <Card>
          {/* We pass in the fulfillmentOrders to child component in order to display them in list view. */}
          <FulfillmentOrderList
            fulfillmentOrders={data.shop.fulfillmentOrders.edges.map(
              ({ node }) => node
            )}
          />
        </Card>
      </Layout.Section>
    )
  );
}
