

## Authenticate a store 
- Resources 
```
https://www.shopify.com/partners/blog/17056443-how-to-generate-a-shopify-api-token
https://shopify.dev/tutorials/authenticate-with-oauth
https://shopify.dev/docs/admin-api/access-scopes
```
- Steps
```
https://ackoo-commerce.myshopify.com/admin/oauth/authorize?client_id=28d64daeadc7b0559907f75c7ccdc286&scope=read_script_tags,write_script_tags,read_orders&redirect_uri=http://localhost/generate_token.php
```
```
http://localhost/generate_token.php?code=4a1748123ffa47387fc4dd577ffa9fbb&hmac=6c02aab6cb578cedd042992bafa9f9a05fbc6b78efff7531c35cdff1c318fd19&host=YWNrb28tY29tbWVyY2UubXlzaG9waWZ5LmNvbS9hZG1pbg&shop=ackoo-commerce.myshopify.com&timestamp=1619202866
```
```
POST https://ackoo-commerce.myshopify.com/admin/oauth/access_token
Request
{
    "client_id": "28d64daeadc7b0559907f75c7ccdc286",
    "client_secret": "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",
    "code": "a19d9d0a0fc2e52995d572db0ccdaa1a"
}
Response
{
    "access_token": "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",
    "scope": "write_script_tags,read_orders"
}
```
## Webhooks

- Get webhooks
```
GET 'https://ackoo-commerce.myshopify.com/admin/api/2021-04/webhooks.json' 
Header 'X-Shopify-Access-Token: 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' 
Response
{
    "webhooks": [
        {
            "id": 1025190690988,
            "address": "https://94b41fda56a7.ngrok.io/webhooks",
            "topic": "app/uninstalled",
            "created_at": "2021-04-18T00:33:54+02:00",
            "updated_at": "2021-04-18T00:33:54+02:00",
            "format": "json",
            "fields": [],
            "metafield_namespaces": [],
            "api_version": "2021-04",
            "private_metafield_namespaces": []
        }
    ]
}
```

- Create webhook
```
POST /admin/api/2021-04/webhooks.json
Header 'X-Shopify-Access-Token: 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' 
Request 
{
  "webhook": {
    "topic": "orders/create",
    "address": "https://whatever.hostname.com/",
    "format": "json"
  }
}
```
 checkouts/create, checkouts/update , checkouts/delete 

## Script tags 
https://shopify.dev/docs/admin-api/rest/reference/online-store/scripttag#update-2021-04

- Get script tags
```
GET https://ackoo-commerce.myshopify.com/admin/api/2021-04/script_tags.json

Headers
X-Shopify-Access-Token: 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
Response: 
{
    "script_tags": []
}
```

- Create script tags
```
POST https://ackoo-commerce.myshopify.com/admin/api/2021-04/script_tags.json

Headers
X-Shopify-Access-Token: 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
Request
{
  "script_tag": {
    "event": "onload",
    "src": "https://djavaskripped.org/fancy.js"
  }
}
Response: 
{
    "script_tags": [
        {
            "id": 170999218348,
            "src": "https://djavaskripped.org/fancy.js",
            "event": "onload",
            "created_at": "2021-04-23T04:47:59+02:00",
            "updated_at": "2021-04-23T04:47:59+02:00",
            "display_scope": "all",
            "cache": false
        }
    ]
}
```

- Delete script tags
```
DELETE https://ackoo-commerce.myshopify.com/admin/api/2021-04/script_tags/170999218348.json

Headers
X-Shopify-Access-Token: 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
```