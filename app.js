const express = require("express"); // Importe le module 'express' pour créer le serveur
const path = require("path"); // Importe le module 'path' pour gérer les chemins de fichiers
const multer = require("multer");
const app = express(); // Crée une application express
const routes = require("./routes"); // Importe le module 'routes'
const bodyParser = require("body-parser"); // Importe le module 'body-parser' pour pouvoir récupérer les données des requêtes HTTP POST
const port = 8500;

// Définit le dossier 'public' comme dossier statique pour que l'on puisse accéder aux fichiers qu'il contient
app.use(express.static(path.join(__dirname, "public"))); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Utilise le module 'routes' pour gérer les routes
app.use("/", routes); 

// On définit le chemin du dossier contenant les .xlsx
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'files'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// On définit le type de fichier accepté
const upload = multer({ storage: storage });

// On définit la route pour l'upload
app.post("/upload", upload.single('file'), (req, res) => {
    res.status(200).send('Fichier enregistré avec succès !');
});

app.listen(port, () => {
    console.log(`Serveur lancé à l'adresse http://localhost:${port}/index`);
});
