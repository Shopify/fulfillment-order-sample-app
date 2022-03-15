import { FulfillmentOrderList } from '../components/FulfillmentOrderList';
import { mount } from '@shopify/react-testing';
import { MockedProvider } from '@apollo/react-testing';
import { createGraphQLFactory } from '@shopify/graphql-testing';
import { IndexTable, PolarisTestProvider } from '@shopify/polaris';
import '@shopify/react-testing/matchers';
import { Toast } from '@shopify/polaris';

const createGraphQL = createGraphQLFactory({});
describe('FulfillmentOrderList', () => {
  let child;
  beforeEach(async () => {
    const graphQL = createGraphQL();
    const list = mount(
      <PolarisTestProvider>
        <MockedProvider graphQL={graphQL.client}>
          <FulfillmentOrderList
            fulfillmentOrders={[
              {
                id: '123',
                order: { id: '234' },
                assignedLocation: { name: 'location 1' },
              },
            ]}
          />
        </MockedProvider>
      </PolarisTestProvider>
    );
    graphQL.wrap((resolve) => list.act(resolve));
    await graphQL.resolveAll();
    child = list.find(FulfillmentOrderList);
  });
  test('should show a row in IndexTable for each fulfillment order', () => {
    expect(child).toContainReactComponent(IndexTable);
    const table = child.find(IndexTable);
    expect(table.children.length).toEqual(1);
  });
});
