import { Layout, Page, Frame } from '@shopify/polaris';

export function PageLayout({ children }) {
  return (
    <Page>
      <Frame>
        <Layout>{children}</Layout>
      </Frame>
    </Page>
  );
}
