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
  const BASE_URL = "https://74a26350a7c6.ngrok.io";
  const [appSecret, setAppSecret] = useState("");
  const [appKey, setAppKey] = useState("");

  const handleAppKeyChange = useCallback((value) => setAppKey(value), []);
  const handleAppSecretChange = useCallback((value) => setAppSecret(value), []);

  const handleSave = async () => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({ app_secret: appSecret, app_key: appKey });
    console.log(body);
    const res = await fetch(`${BASE_URL}/shop/keys`, {
      method: "POST",
      headers: headers,
      body: body,
    });
    console.log(res);
    if (res.status === 200) {
      const result = await res.json();
      console.log("result", result);
    }
  };

  const handleDelete = () => {
    setAppSecret("");
    setAppKey("");
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
              value={appSecret}
              onChange={handleAppSecretChange}
              label="App Secret"
              type="App Secret"
            />

            <TextField
              value={appKey}
              onChange={handleAppKeyChange}
              label="App Key"
              type="App Key"
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
