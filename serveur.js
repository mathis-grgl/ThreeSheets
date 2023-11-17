import { createServer } from "http";

let directory = process.cwd() + "/directory/";
let server = createServer((request, response) => { // paramétrage
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.write(`
<h1>Félicitations !</h1>
<p>Vous venez de créer votre premier serveur.</p>
<p>Vous cherchiez à accéder à la ressource <code>${directory + request.url}</code> en
utilisant la méthode <code>${request.method}</code>.</p>`);
    response.end();
});
server.listen(8500); // start !
console.log("Serveur lancé.");