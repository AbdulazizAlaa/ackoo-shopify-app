export class ShopDAO {
  constructor({ name, access_token, api_key, api_secret }) {
    this.name = name;
    this.access_token = access_token;
    this.api_key = api_key;
    this.api_secret = api_secret;
  }
}
