import { Heading, Page, Button } from "@shopify/polaris";

const Index = () => {
  console.log("props", this.props);
  return (
    <Page>
      <Heading>Shopify app with Node and React 🎉</Heading>
      <Button> Click </Button>
    </Page>
  );
}

export default Index;
