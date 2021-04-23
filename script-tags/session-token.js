console.log("------- Ackoo script -------");
const params = new URLSearchParams(location.search);
const sessionToken = params.get("token");
console.log(location, location.search);
console.log(`Session token: ${sessionToken}`);
for (let p of params) {
    console.log(p);
}

console.log("Shopify", Shopify);