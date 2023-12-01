const express = require("express"); // Importe le module 'express' pour créer le serveur
const path = require("path"); // Importe le module 'path' pour gérer les chemins de fichiers
const app = express(); // Crée une application express
const routes = require("./routes"); // Importe le module 'routes'
const routesBdd = require("./routesBdd"); // Importe le module 'routesBdd' ou se trouve les requêtes SQL
const routesFichier = require("./routesFichier"); // Importe le module 'routesFichier' ou se trouve les requêtes de gestion de fichiers .xlsx
const bodyParser = require("body-parser"); // Importe le module 'body-parser' pour pouvoir récupérer les données des requêtes HTTP POST
const { log } = require("console");
const http = require('http').Server(app); // Importe le module 'http' pour créer le serveur
const io = require('socket.io')(http); // Importe le module 'socket.io' pour gérer les sockets
const port = 8500;

// Création d'un ensemble pour stocker les identifiants d'utilisateurs connectés
const connectedUsers = new Set();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// On récupère la liste des utilisateurs connectés
function getConnectedUsers() {
    return Array.from(connectedUsers); // Convertit l'ensemble en tableau pour l'envoyer au client
}

// On défini la route pour la récupération des données de session
app.get('/infos-session', (req, res) => {
    const sessionData = req.session; // Accès aux données de session

    // Faites quelque chose avec les informations de session
    res.send(sessionData);
});



/* ######### Gestion des sockets ######### */

// On gere les sockets
io.on('connection', (socket) => {
    // Gestionnaire d'événements pour la connexion d'un utilisateur
    socket.on('join', (userId) => {
        // Si l'utilisateur n'est pas déjà connecté, on l'ajoute à l'ensemble
        if (!connectedUsers.has(userId.toString())) {
            connectedUsers.add(userId.toString());
            console.log(`Utilisateur connecté : ${userId}`);
            // Envoi d'un événement à tous les clients pour informer de la nouvelle connexion
            io.emit('newUser', { userId : userId, connectedUsers: getConnectedUsers() });
        }
    });

    // Gestionnaire d'événements pour la déconnexion d'un utilisateur
    socket.on('leave', (userId) => {
        // Si l'utilisateur est connecté, on le supprime de l'ensemble
        if (connectedUsers.has(userId.toString())) {
            connectedUsers.delete(userId.toString());
            console.log(`Utilisateur déconnecté : ${userId}`);
            // Envoi d'un événement à tous les clients pour informer de la déconnexion
            socket.broadcast.emit('leavingUser', { userId: userId, connectedUsers: getConnectedUsers() });
        }
    });

    // Gestionnaire d'événements pour la modification de texte dans une cellule
    socket.on('modificationTexte', (data) => {
        // Émettre la modification à tous les clients connectés sauf à l'émetteur
        socket.broadcast.emit('modificationTexte', data);
    });

    // Gestionnaire d'événements pour la modification du titre du fichier
    socket.on('modificationTitre', (data) => {
        // Émettre la modification à tous les clients connectés sauf à l'émetteur
        socket.broadcast.emit('modificationTitre', data);
    });

    // Gestionnaire d'événements pour la modification de style dans une cellule
    socket.on('modificationStyle', (data) => {
        // Émettre la modification à tous les clients connectés sauf à l'émetteur
        socket.broadcast.emit('modificationStyle', data);
    });

    // Gestionnaire d'événements pour la suppression d'un document
    socket.on('changeDocument', (data) => {
        // Émettre la suppression à tous les clients connectés sauf à l'émetteur
        socket.broadcast.emit('changeDocument');
    });
})
  
// On lance le serveur sur le port 8500 avec socket.io
http.listen(port, () => {
    console.log(`Serveur lancé à l'adresse http://localhost:${port}/index`);
});



/* ######### Definition des routes ######### */

// Définissez votre chemin pour servir les fichiers statiques depuis node_modules
app.use(express.static(path.join(__dirname , "node_modules")));

// Définit le dossier 'public' comme dossier statique pour que l'on puisse accéder aux fichiers qu'il contient
app.use(express.static(path.join(__dirname, "public"))); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Utilise le module 'routes' pour gérer les routes
app.use("/", routes); 

// Utilise le module 'routesBdd' pour gérer les routes de la base de données
app.use("/", routesBdd);

// Utilise le module 'routesFichier' pour gérer les routes des fichiers .xlsx
app.use("/", routesFichier);