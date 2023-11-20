const db = require('./db');

function getUserByEmailAndPassword(email, motDePasse, callback) {
    db.get('SELECT * FROM compte WHERE email = ? AND mdp = ?', [email, motDePasse], callback);
}

function createUser(email, motDePasse, pseudo, callback) {
    db.run('INSERT INTO compte (email, mdp, pseudo) VALUES (?, ?, ?)', [email, motDePasse, pseudo], callback);
}

function createFile(titre, idCreateur, callback) {
    db.run('INSERT INTO document (titre, idCreateur) VALUES (?, ?)', [titre, idCreateur], callback);
}


function getFiles(idCreateur, callback) {
    db.all('SELECT * FROM document WHERE idCreateur = ?', [idCreateur], callback);
}

module.exports = { getUserByEmailAndPassword, createUser, createFile, getFiles};