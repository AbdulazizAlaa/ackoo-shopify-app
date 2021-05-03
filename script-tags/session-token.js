const userAction = async (shop, checkoutToken, sessionToken) => {
    const host = '54c532f2b037.ngrok.io';
    const API_URL = `https://${host}/checkout/confirm`;
    const body = {
        shop: shop,
        checkout_token: checkoutToken,
        session_token: sessionToken
    };
    
    console.log(API_URL, body);
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(body), 
        headers: {
            'Content-Type': 'application/json'
        }
    });
    try{
        const myJson = await response.json(); //extract JSON from the http response
        // do something with myJson
        console.log(myJson);
    }catch(e){
        console.log(e);
    }
    localStorage.setItem("sessionToken", "");
};

console.log("------- Ackoo script -------");
const params = new URLSearchParams(location.search);
const sessionToken = params.get("token");
console.log(`Query Session token: ${sessionToken}`);
console.log("Shopify Object:", Shopify);

if (sessionToken !== undefined && sessionToken !== null) {
    localStorage.setItem("sessionToken", sessionToken);
}

const storedSessionToken = localStorage.getItem('sessionToken');
console.log(`Stored Session token: ${storedSessionToken}`);

if (Shopify !== undefined && Shopify.checkout !== undefined) {
    const checkoutToken = Shopify.checkout.token;
    const shop = Shopify.shop;
    userAction(shop, checkoutToken, storedSessionToken);
    console.log(`Checkout token: ${checkoutToken} - Shop ${shop}`);
}