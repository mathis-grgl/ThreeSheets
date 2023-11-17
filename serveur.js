import { createServer } from "http";
import fs from "fs"; // Importez le module 'fs' pour la lecture des fichiers

const server = createServer((request, response) => {
    // Vérifiez si la demande est pour lanp racine '/'
    if (request.url === '/' || request.url === '/index.html') {
        
        // Utilisez fs pour lire le fichier index.html
        fs.readFile('html/index.html', (err, data) => {
            if (err) {
                // En cas d'erreur, affichez un message d'erreur dans la console
                console.error(err);
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Internal Server Error');
            } else {
                // Si la lecture du fichier est réussie, renvoyez le contenu de index.html
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(data);
            }
        });
    } else {
        // Si la demande n'est pas pour '/', redirigez vers index.html
        response.writeHead(302, { "Location": "html/index.html" });
        response.end();
    }
});

server.listen(8500, () => {
    console.log("Serveur lancé sur le port 8500.");
});
