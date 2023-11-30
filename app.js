const express = require("express"); // Importe le module 'express' pour créer le serveur
const path = require("path"); // Importe le module 'path' pour gérer les chemins de fichiers
const multer = require("multer");
const app = express(); // Crée une application express
const fs = require('fs'); // Importe le module 'fs' pour gérer les fichiers
const routes = require("./routes"); // Importe le module 'routes'
const bodyParser = require("body-parser"); // Importe le module 'body-parser' pour pouvoir récupérer les données des requêtes HTTP POST
const db = require('./public/js/gestionBdd');
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



//* ######### Gestion des fichiers .xlsx ######### */

// On définit le chemin du dossier contenant les .xlsx
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'public', 'files');
        // Vérifier si le dossier de destination existe, sinon le créer
        fs.access(uploadDir, (error) => {
            if (error) {
                // Le dossier n'existe pas, on le crée
                fs.mkdir(uploadDir, { recursive: true }, (err) => {
                    if (err) {
                        console.error('Erreur lors de la création du dossier :', err);
                        cb(err, null);
                    } else {
                        // Dossier créé, on indique à Multer le chemin
                        cb(null, uploadDir);
                    }
                });
            } else {
                // Le dossier existe déjà
                cb(null, uploadDir);
            }
        });
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// On définit le type de fichier accepté
const upload = multer({ storage: storage });

// On définit la route pour l'upload du fichier .xlsx
app.post("/upload", upload.single('file'), (req, res) => {
    res.status(200).send('Fichier enregistré avec succès !');
});

// On défini la route pour le téléchargement du fichier .xlsx
app.get("/download/:filename", (req, res) => {
    res.download(path.join(__dirname, 'public', 'files', req.params.filename));
});

// On défini la route pour la suppression du fichier .xlsx
app.get("/delete/:filename", (req, res) => {
    fs.unlink(path.join(__dirname, 'public', 'files', req.params.filename), (err) => {
        if (err) throw err;
        res.status(200).send('Fichier supprimé avec succès !');
    });
});

// On défini la route pour la modification du fichier .xlsx
app.post("/edit", (req, res) => {
    const workbook = xlsx.readFile(path.join(__dirname, 'public', 'files', req.body.filename));
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    worksheet['A1'].v = req.body.titre;
    xlsx.writeFile(workbook, path.join(__dirname, 'public', 'files', req.body.filename));
    res.status(200).send('Fichier modifié avec succès !');
});



/* ######### Gestion des requetes de la base de données ######### */

 // On défini la toute pour la création d'un document dans la db
 app.post("/create", (req, res) => {
    const { titre, idCreateur } = req.body;
    db.createFile(titre, idCreateur, (err) => {
        if (err) {
            res.status(500).send('Erreur lors de la création du document.');
        } else {
            res.status(200).send('Document créé/modifié avec succès !');
        }
    });
});

// On défini la route pour la récupération des documents dans la db
app.get("/get/:idCreateur", (req, res) => {
    db.getFiles(req.params.idCreateur, (err, rows) => {
        if (err) throw err;
        res.status(200).send(rows);
    });
});

// On défini la route pour la récupération de tout les comptes dans la db
app.get("/getAllUsers", (req, res) => {
    db.getAllUsers((err, rows) => {
        if (err) throw err;
        res.status(200).send(rows);
    });
});

// On défini la route pour la récupération de tout les documents dans la db
app.get("/getAll", (req, res) => {
    db.getAllFiles((err, rows) => {
        if (err) throw err;
        res.status(200).send(rows);
    });
});

// On défini la route pour la récupération d'une documents partagés associés à un utilisateur dans la db
app.get("/getSharedDocumentsByUser/:id", (req, res) => {
    db.getSharedDocumentsByUser(req.params.id, (err, file) => {
        if (err) throw err;
        res.status(200).send(file);
    });
});


// On défini la route pour la modification d'un document dans la db
app.post("/edit", (req, res) => {
    db.editFile(req.body.id, req.body.titre, (err) => {
        if (err) throw err;
        res.status(200).send('Document modifié avec succès !');
    });
});

// On défini la route pour la récupération d'un document dans la db par son id
app.get("/getFileById/:id", (req, res) => {
    db.getFileById(req.params.id, (err, file) => {
        if (err) throw err;
        res.status(200).send(file);
    });
});


// On défini la route pour la suppression d'un document dans la db et dans le serveur
app.delete("/delete/:id", (req, res) => {
    db.getFileById(req.params.id, (err, file) => {
        if (err) {
            throw err;
        } else if (!file) {
            res.status(404).send('Document non trouvé !');
        } else {
            // On récupère les données de session puis l'id du compte connecté
            const sessionData = req.session;
            db.getIdByEmail(sessionData.email, (err, compte) => {
                if (err) throw err;
                // Si l'id du créateur du document est différent de l'id du compte connecté alors on peut pas supprimer le document
                if (file.idCreateur !== compte.idCompte) {
                    res.status(403).send('Vous n\'êtes pas autorisé à supprimer ce document');
                } else {
                    // Suppression du fichier .xlsx du serveur
                    const filePath = path.join(__dirname, 'public', 'files', file.titre + '.xlsx');
                    fs.unlink(filePath, (err) => {
                        // Si il y a une erreur lors de la suppression du fichier avec fs.unlink
                        if (err) {
                            console.error(err);
                            res.status(500).send('Erreur lors de la suppression du fichier');
                        } else {
                            // Suppression du document dans la base de données
                            db.deleteFile(req.params.id, (err) => {
                                if (err) {
                                    console.error(err);
                                    res.status(500).send('Erreur lors de la suppression du document dans la base de données');
                                } else {
                                    res.status(200).send('Document et fichier .xlsx supprimés avec succès !');
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

// On défini la route pour la récupération de l'idCreateur
app.get('/getIdCreateur', (req, res) => {
    const sessionData = req.session; // Accès aux données de session

    // FOn récupère l'id du créateur avec son email
    db.getIdByEmail(sessionData.email, (err, idCreateur) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération de l\'ID créateur');
            return;
        }
        res.status(200).json({ idCreateur: idCreateur });
    });
});

// On défini la route pour la récupération d'un utilisateur par la session
app.get('/getUser', (req, res) => {
    const sessionData = req.session; // Accès aux données de session

    // FOn récupère l'id du créateur avec son email
    db.getUserByEmail(sessionData.email, (err, user) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération de l\'utilisateur');
            return;
        }
        res.status(200).json({ user: user });
    });
});

// On défini la route pour la récupération d'un utilisateur par son id
app.get('/getUserById/:id', (req, res) => {
    // FOn récupère l'id du créateur avec son email
    db.getUserById(req.params.id, (err, user) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération de l\'utilisateur');
            return;
        }
        res.status(200).json({ user: user });
    });
});

// On défini la route pour l"ajout d'un utilisateur dans un document partagé
app.get('/shareDocument/:idDocument/:idCompte', (req, res) => {
    db.shareDocument(req.params.idDocument, req.params.idCompte, (err) => {
        if (err) {
            res.status(500).send('Erreur lors de l\'ajout de l\'utilisateur dans le document partagé');
            return;
        }
        res.status(200).send('Utilisateur ajouté avec succès !');
    });
});

// Route pour retirer un utilisateur d'un partage
app.get('/removeShare/:idDocument/:idCompte', (req, res) => {
    db.deleteShare(req.params.idDocument, req.params.idCompte, (err) => {
        if (err) {
            res.status(500).send('Erreur lors de la suppression de l\'utilisateur du partage');
            return;
        }
        res.status(200).send('Utilisateur retiré avec succès du partage !');
    });
});

// On défini la route pour la récupération des données de session
app.get('/infos-session', (req, res) => {
    const sessionData = req.session; // Accès aux données de session

    // Faites quelque chose avec les informations de session
    res.send(sessionData);
});