
const fs = require("fs"); // Importe le module 'fs' pour gérer les fichiers
const express = require("express"); // Importe le module 'express' pour créer le serveur
const path = require("path"); // Importe le module 'path' pour gérer les chemins de fichiers
const app = express(); // Crée une application express
const port = 8500;

app.use(express.static(path.join(__dirname, "public"))); // Définit le dossier 'public' comme dossier statique pour que l'on puisse accéder aux fichiers qu'il contient

app.get("/", (req, res) => { // Définit la route '/' pour envoyer le fichier 'index.html'
    res.sendFile(__dirname + "/public/views/index.html");
});

app.get((req, res) => { 
    res.sendFile(__dirname + `/public/views/${req.url}`);
});


app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}`);
});
