const sqlite3 = require('sqlite3').verbose();

function test(){
}
let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
    console.error(err.message);
    }
    console.log('Connected to the database.');
});
    console.log("test");

        db.serialize(() => {
            db.each(`SELECT * FROM compte`, (err, row) => {
            if (err) {
                console.error(err.message);
            }
            console.log(row.idCompte + "\t" + row.email + "\t" + row.mdp);
            });
        });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
        });


module.exports = { test };
