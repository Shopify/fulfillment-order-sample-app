import { gql, useQuery } from '@apollo/client';
import { Loading, useAppBridge } from '@shopify/app-bridge-react';
import { Banner, Card, Layout } from '@shopify/polaris';
import { userLoggedInFetch } from '../../App';
import { FulfillmentOrderList } from './FulfillmentOrderList';

const FULFILLMENT_ORDER_QUERY = gql`
  {
    shop {
      fulfillmentOrders(first: 10) {
        edges {
          node {
            id
            order {
              id
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
    console.log("error", error);
    return (
      <Banner status="critical">
        There was an issue loading FulfillmentOrders.
      </Banner>
    );
  }
  return (
    <Layout.Section>
      <Card>

        <FulfillmentOrderList
          fulfillmentOrders={data.shop.fulfillmentOrders.edges.map(
            ({ node }) => node
          )}
        />
      </Card>
    </Layout.Section>
  );
}
