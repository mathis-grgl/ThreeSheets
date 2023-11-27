const db = require('./db');

function getUserByEmailAndPassword(email, motDePasse, callback) {
    db.get('SELECT * FROM compte WHERE email = ? AND mdp = ?', [email, motDePasse], callback);
}

function createUser(email, motDePasse, pseudo, callback) {
    db.run('INSERT INTO compte (email, mdp, pseudo) VALUES (?, ?, ?)', [email, motDePasse, pseudo], callback);
}

function getUserByEmail(email, callback) {
    db.get('SELECT idCompte, pseudo, email FROM compte WHERE email = ?', [email], callback);
}

function getUserById(id, callback) {
    db.get('SELECT idCompte, pseudo, email FROM compte WHERE idCompte = ?', [id], callback);
}

function getIdByEmail(email, callback) {
    db.get('SELECT idCompte FROM compte WHERE email = ?', [email], callback);
}

function createFile(titre, idCreateur, callback) {
    db.run('INSERT INTO document (titre, idCreateur) VALUES (?, ?)', [titre, idCreateur], callback);
}


function getFileById(idDocument, callback) {
    db.get('SELECT * FROM document WHERE idDocument = ?', [idDocument], callback);
}

function getAllFiles(callback) {
    db.all('SELECT * FROM document', callback);
}

function editFile(id, titre, callback) {
    db.run('UPDATE document SET titre = ? WHERE id = ?', [titre, id], callback);
}

function deleteFile(idDocument, callback) {
    db.run('DELETE FROM document WHERE idDocument = ?', [idDocument], callback);
}

module.exports = { getUserByEmailAndPassword, createUser, createFile, getFileById, editFile, deleteFile, getIdByEmail, getAllFiles, getUserByEmail, getUserById};