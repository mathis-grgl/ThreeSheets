BEGIN;

INSERT INTO COMPTE(pseudo, email, mdp)VALUES('Boubix88', 'sandy.gehin@gmail.com', '1234');
INSERT INTO COMPTE(pseudo, email, mdp) VALUES('TriBlue', 'georgel.mathis@gmail.com', '1234');
INSERT INTO COMPTE(pseudo, email, mdp)VALUES('Onin88', 'q.b@gmail.com', '1234');

INSERT INTO DOCUMENT(titre, idCreateur) VALUES('Document 1', 1);

INSERT INTO PARTAGE(idDocument, idCompte) VALUES(1, 2);

COMMIT;

