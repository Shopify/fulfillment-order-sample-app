import { FulfillmentOrderList } from '../components/FulfillmentOrderList';
import { mount } from '@shopify/react-testing';
import { MockedProvider } from '@apollo/react-testing';
import { createGraphQLFactory } from '@shopify/graphql-testing';
import {
  IndexTable,
  PolarisTestProvider,
  Button,
  Modal,
  TextField,
} from '@shopify/polaris';
import '@shopify/react-testing/matchers';

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

  //test for many fulfillment orders in table
  // test for fulfill button with graphql

  test('should show a column to add a message on an order', () => {
    expect(child).toContainReactText('Fulfillment Message');
    child.find(Button, { id: '123' }).trigger('onClick');
    expect(child).toContainReactComponent(Modal);
    // type
    // console.log(child.find(Modal).find(TextField));
    // .trigger('onChange', { event: { target: { value: 'test' } } });
    /// make sure the graphql includes that message
  });
});
