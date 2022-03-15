import { gql, useQuery } from '@apollo/client';
import { Loading } from '@shopify/app-bridge-react';
import { Banner, Card, Layout } from '@shopify/polaris';
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
            merchantRequests(first: 10) {
              edges {
                node {
                  message
                }
              }
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
    return (
      <Banner status="critical">
        There was an issue loading FulfillmentOrders.
      </Banner>
    );
  }

  return (
    <Layout.Section>
      HELLO
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
