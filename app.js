const express = require("express"); // Importe le module 'express' pour créer le serveur
const path = require("path"); // Importe le module 'path' pour gérer les chemins de fichiers
const app = express(); // Crée une application express
const routes = require("./routes"); // Importe le module 'routes'
const port = 8500;

// Définit le dossier 'public' comme dossier statique pour que l'on puisse accéder aux fichiers qu'il contient
app.use(express.static(path.join(__dirname, "public"))); 

// Utilise le module 'routes' pour gérer les routes
app.use("/", routes); 

app.listen(port, () => {
    console.log(`Serveur lancé à l'adresse http://localhost:${port}/index.html`);
});
