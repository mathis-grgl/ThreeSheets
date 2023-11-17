import { stat, readdir, createReadStream } from "fs";
import { createServer } from "http";
import pkg from 'mime';
const { getType } = pkg;

let server = createServer((request, response) => { // paramétrage
    if (request.method !== 'GET') {
        response.writeHead(405);
        response.end('Method Not Allowed');
        return;
    }

    let chemin = process.cwd() + request.url;
    stat(chemin, (error, stats) => {
        if (error) {
            response.writeHead(404);
            response.end('Pas de fichier trouvé');
        } else {
            if (stats.isFile()) {
                console.log("c'est un fichier");
                let header = getType(chemin);
                response.setHeader('Content-Type', getType(header));
                let stream = createReadStream(chemin);
                stream.pipe(response);
            }
            if (stats.isDirectory()) {
                console.log("c'est un dossier");
                readdir(chemin, (error, files) => {
                    if (error) {
                        response.writeHead(500);
                        response.end('Internal Server Error');
                        return;
                    }

                    response.writeHead(200, { "Content-type": "text/html; charset=utf-8" });
                    response.write("<hl>Liste des fichiers dans le dossier</hl>");
                    response.write("<ul>");
                    files.forEach(file => {
                        console.log("chemin fichier : " + chemin + file);
                        response.write("<li> <a href=\"" + chemin + file + "\"> " + file + "</a> </li>");
                    });
                    response.write("</ul>");
                    response.end();
                });
            }
        }
    });
});
server.listen(8500); // start !
console.log("Serveur lancé.");

