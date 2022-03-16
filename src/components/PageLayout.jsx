import { Layout, Page, Frame } from '@shopify/polaris';

export function PageLayout({ children }) {
  return (
    <Frame>
      <Page>
        <Layout>{children}</Layout>
      </Page>
    </Frame>
  );
}
