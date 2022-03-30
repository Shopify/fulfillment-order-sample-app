# Shopify Reference - Fulfillment App

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

This is an reference app to show how the Shopify GQL Admin API fulfillmentOrder
object can be used. When using this code keep in mind: This is a sample
application. It is not production-ready, many edge cases are not covered.

It leverages the
[Shopify API Library](https://github.com/Shopify/shopify-node-api) on the
backend to create
[an embedded app](https://shopify.dev/apps/tools/app-bridge/getting-started#embed-your-app-in-the-shopify-admin),
and [Polaris](https://github.com/Shopify/polaris-react) and
[App Bridge React](https://shopify.dev/tools/app-bridge/react-components) on the
frontend.

This is the bases on the Node app generated with the
[Shopify CLI](https://shopify.dev/apps/tools/cli).

## Requirements

- If you don’t have one,
  [create a Shopify partner account](https://partners.shopify.com/signup).
- If you don’t have one,
  [create a Development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store)
  where you can install and test your app.
- **If you are not using the Shopify CLI**, in the Partner dashboard,
  [create a new app](https://help.shopify.com/en/api/tools/partner-dashboard/your-apps#create-a-new-app).
  You’ll need this app’s API credentials during the setup process.
- A store with orders eligible for fulfillment.

## Installation

Using the [Shopify CLI](https://github.com/Shopify/shopify-cli) run:

```sh
shopify app create node -n APP_NAME
```

Or, you can run `npx degit shopify/shopify-app-node` and create a `.env` file
containing the following values:

```yaml
SHOPIFY_API_KEY={api key}                                     # Your API key
SHOPIFY_API_SECRET={api secret key}                           # Your API secret key
SCOPES=write_merchant_managed_fulfillment_orders,write_orders # Your app's required scopes, comma-separated
HOST={your app's host}                                        # Your app's host, without the protocol prefix
```

## Developer resources

- For more information on migration check out our
  [migration guide](https://shopify.dev/apps/fulfillment/migrate)

- Reference the
  [fulfillmentOrders Object](https://shopify.dev/api/admin-graphql/2022-01/objects/Shop#connection-shop-fulfillmentorders)

## License

This repository is available as open source under the terms of the
[MIT License](https://opensource.org/licenses/MIT).
