import { FulfillmentOrdersPage } from '../components/FulfillmentOrderPage';
import { createMount } from '@shopify/react-testing';

import { MockProvider } from '@apollo/react-testing';
import { Page } from '@shopify/polaris';
import { PolarisTestProvider } from '@shopify/polaris';
import en from '@shopify/polaris/locales/en.json';

const mount = createMount({
  context(options) {
    return options;
  },
  render(element, context) {
    return (
      <PolarisTestProvider i18n={en} {...context}>
        <MockProvider>{element}</MockProvider>
      </PolarisTestProvider>
    );
  },
});

test('loads and displays greeting', async () => {
  const wrapper = mount(<FulfillmentOrdersPage />);
  expect(wrapper).toContainReactText('Page');
});
