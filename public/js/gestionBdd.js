const db = require('./db');

function getUserByEmailAndPassword(email, motDePasse, callback) {
    db.get('SELECT * FROM compte WHERE email = ? AND mdp = ?', [email, motDePasse], callback);
}

function createUser(email, motDePasse, pseudo, callback) {
    db.run('INSERT INTO compte (email, mdp, pseudo) VALUES (?, ?, ?)', [email, motDePasse, pseudo], callback);
}

module.exports = { getUserByEmailAndPassword, createUser};