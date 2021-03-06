import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import {
  Provider as AppBridgeProvider,
  useAppBridge,
} from '@shopify/app-bridge-react';
import { authenticatedFetch } from '@shopify/app-bridge-utils';
import { Redirect } from '@shopify/app-bridge/actions';
import { AppProvider as PolarisProvider } from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';

import { PageLayout } from './components/PageLayout';
import { FulfillmentOrdersPage } from './components/NewFulfillmentOrder/FulfillmentOrderPage';
import { OrderPage } from './components/LegacyFulfillmentOrder/OrderPage';
export default function App() {
  return (
    <PolarisProvider i18n={translations}>
      <AppBridgeProvider
        config={{
          apiKey: process.env.SHOPIFY_API_KEY,
          host: new URL(location).searchParams.get('host'),
          forceRedirect: true,
        }}
      >
        <MyProvider>
          <PageLayout>
            {/* This component highlights the Shopify GQL Admin API using the fulfillmentOrder object */}
            <FulfillmentOrdersPage />

            {/* This component shows the deprecated Shopify Rest Admin API using fulfillments on the Order object */}
            <OrderPage />
          </PageLayout>
        </MyProvider>
      </AppBridgeProvider>
    </PolarisProvider>
  );
}

// The follow code is cloned from the shopify app starter template: https://github.com/Shopify/shopify-app-node
// It points the apollo client to our server defined at serve/index.js
function MyProvider({ children }) {
  const app = useAppBridge();

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      credentials: 'include',
      fetch: userLoggedInFetch(app),
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get('X-Shopify-API-Request-Failure-Reauthorize') === '1'
    ) {
      const authUrlHeader = response.headers.get(
        'X-Shopify-API-Request-Failure-Reauthorize-Url'
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}
