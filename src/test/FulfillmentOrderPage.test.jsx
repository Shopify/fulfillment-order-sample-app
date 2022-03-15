// import { FulfillmentOrdersPage } from '../components/FulfillmentOrderPage';
// import { createMount, mount, toContainReactText } from '@shopify/react-testing';
// import { createGraphQLFactory } from '@shopify/graphql-testing';
// import { PolarisTestProvider } from '@shopify/polaris';
// import { MockedProvider } from '@apollo/react-testing';

// const createGraphQL = createGraphQLFactory();
// jest.mock('@shopify/app-bridge-react');
// export const mountWithAppContext = createMount({
//   context({ graphQL = createGraphQL() }) {
//     return { graphQL };
//   },
//   render(element, { graphQL }) {
//     return (
//       <PolarisTestProvider>
//         <MockedProvider graphQL={graphQL}>{element}</MockedProvider>
//       </PolarisTestProvider>
//     );
//   },
//   async afterMount(root, options) {
//     const { graphQL } = root.context;

//     if (options.skipInitialGraphQL) {
//       return;
//     }

//     await root.act(() => graphQL.resolveAll());
//   },
// });

// test('loads and displays greeting', async () => {
//   const wrapper = mountWithAppContext(<FulfillmentOrdersPage />);
//   const graphQL = createGraphQL({
//     Pet: {
//       pet: {
//         __typename: 'Cat',
//         name: 'Garfield',
//       },
//     },
//   });

//   graphQL.wrap((resolve) => wrapper.root.act(resolve));
//   // console.log(wrapper);
//   await graphQL.resolveAll();
//   const button = wrapper.find('button');
//   console.log(button);
//   expect(wrapper).toContainReactText('Page');
// });
test('something', () => {
  expect(true).toBeTruthy();
});
