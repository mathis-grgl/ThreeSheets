import { createServer } from "http";

let server = createServer((request, response) => { // paramétrage
    // redirect to index.html
    response.writeHead(302, {  "Location": "/index.html" });
    
    response.end();
});
server.listen(8500); // start !
console.log("Serveur lancé.");