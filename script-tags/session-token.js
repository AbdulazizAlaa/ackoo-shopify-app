console.log("hiiii");
const url = location.href;
const params = new URLSearchParams(url);
const sessionToken = params.get("token");
console.log(location, location.search, url);
console.log(params, sessionToken);
for (let p of params) {
    console.log(p);
}