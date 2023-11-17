const express = require('express');
const connexion = require('./public/js/connexion.js');
const router = express.Router();

// Définit les routes
router.use("/index", (req, res) => { 
    res.sendFile(__dirname + `/public/views/index.html`);
});

router.use("/connexion", (req, res) => { 
    res.sendFile(__dirname + `/public/views/connexion.html`);
});

router.post("/connexion", (req, res) => {
    console.log("appuie");
    connexion.test();
});


module.exports = router;