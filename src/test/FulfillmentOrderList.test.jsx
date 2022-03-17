import { FulfillmentOrderList } from '../components/FulfillmentOrderList';
import { mount } from '@shopify/react-testing';
import { MockedProvider } from '@apollo/react-testing';
import { createGraphQLFactory } from '@shopify/graphql-testing';
import {
  IndexTable,
  PolarisTestProvider,
  Button,
  Modal,
} from '@shopify/polaris';
import '@shopify/react-testing/matchers';
import { useFulfillmentCreateV2 } from '../hooks/useFulfillmentCreateV2';

const createGraphQL = createGraphQLFactory();
describe('FulfillmentOrderList', () => {
  let child;
  const graphQL = createGraphQL();
  beforeEach(async () => {
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
              {
                id: '345',
                order: { id: '444' },
                assignedLocation: { name: 'location 2' },
              },
              {
                id: '678',
                order: { id: '222' },
                assignedLocation: { name: 'location 1' },
              },
              {
                id: '901',
                order: { id: '222' },
                assignedLocation: { name: 'location 2' },
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
    expect(child).toContainReactComponentTimes(IndexTable.Row, 4);
  });
  // test for fulfill button with graphql
  test('should show a row in IndexTable for each fulfillment order', () => {
    child.find(Button, { id: '123' });
    // expect(graphQL.operations.all({ mutation: createFulfillmentMutation }));
    // expect(graphQL).toHavePerformedGraphQLOperation(useFulfillmentCreateV2);
  });

  test('should show a column to add a message on an order', () => {
    expect(child).toContainReactText('Fulfillment Message');
    child.find(Button, { id: '123' });
    expect(child).toContainReactComponent(Modal);
  });
});
