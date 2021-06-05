import { useCallback, useState } from "react";
import {
  Page,
  PageActions,
  Card,
  Form,
  FormLayout,
  TextField,
} from "@shopify/polaris";

const Index = () => {
  const BASE_URL = "https://f453b08b53eb.ngrok.io";
  const [apiSecret, setApiSecret] = useState("");
  const [apiKey, setApiKey] = useState("");

  const handleApiKeyChange = useCallback((value) => setApiKey(value), []);
  const handleApiSecretChange = useCallback((value) => setApiSecret(value), []);

  const handleSave = async () => {
    console.log("hiiii");
    console.log(apiSecret, apiKey);

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({ api_secret: apiSecret, api_key: apiKey });
    const res = await fetch(`${BASE_URL}/shop/keys`, {
      method: "POST",
      headers: headers,
      body: body,
    });
    const result = await res.json();
    console.log(result);
  };

  const handleDelete = () => {
    setApiSecret("");
    setApiKey("");
  };

  // const headers = {
  //   "Accept": "application/json",
  //   "Content-Type": "application/json",
  // };
  // const res = await fetch(`${BASE_URL}/shop/keys`, {method: "GET", headers: headers});
  // const result = await res.json();
  // console.log(result);

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
              value={apiSecret}
              onChange={handleApiSecretChange}
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
