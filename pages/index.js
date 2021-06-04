import { useCallback, useState } from "react";
import {
  Page,
  PageActions,
  Card,
  Form,
  FormLayout,
  TextField,
} from "@shopify/polaris";

const Index = (context) => {
  const [accessKey, setAccessKey] = useState("");
  const [apiKey, setApiKey] = useState("");

  const handleApiKeyChange = useCallback((value) => setApiKey(value), []);
  const handleAccessKeyChange = useCallback((value) => setAccessKey(value), []);

  const handleSave = async () => {
    console.log("hiiii");
    console.log(accessKey, apiKey);

    const headers = {
      "x-shopify-shop-domain": "",
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({ access_key: accessKey, api_key: apiKey });
    const res = await fetch("https://a892c244c631.ngrok.io/shop/keys", {
      method: "POST",
      headers: headers,
      body: body,
    });
    const result = await res.json();
    console.log(result);
  };

  const handleDelete = () => {
    setAccessKey("");
    setApiKey("");
  };

  return (
    <Page
      narrowWidth
      title="Ackoo Keys"
      primaryAction={{ content: "Save", onAction: handleSave }}
    >
      <Card title="Ackoo Keys" sectioned>
        <Form>
          <FormLayout>
            <TextField
              value={accessKey}
              onChange={handleAccessKeyChange}
              label="Access Key"
              type="Access Key"
            />

            <TextField
              value={apiKey}
              onChange={handleApiKeyChange}
              label="API Key"
              type="API Key"
            />
          </FormLayout>
        </Form>
      </Card>
      <PageActions
        primaryAction={{ content: "Save", onAction: handleSave }}
        secondaryActions={[{ content: "Delete", onAction: handleDelete }]}
      />
    </Page>
  );
};

export default Index;
