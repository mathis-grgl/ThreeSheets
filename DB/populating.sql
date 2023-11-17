BEGIN;

INSERT INTO COMPTE(nomCompte, prenomCompte, email, adresse, mdp) VALUES('GEHIN', 'Sandy', 'sandy.gehin@gmail.com', '1 rue de la paix', '1234');
INSERT INTO COMPTE(nomCompte, prenomCompte, email, adresse, mdp) VALUES('GEORGEL', 'Mathis', 'georgel.mathis@gmail.com', '2 rue de la paix', '1234');
INSERT INTO COMPTE(nomCompte, prenomCompte, email, adresse, mdp) VALUES('BELUCHE', 'Quentin', 'q.b@gmail.com', '3 rue de la paix', '1234');

INSERT INTO DOCUMENT(titre, idCreateur) VALUES('Document 1', 1);

INSERT INTO PARTAGE(idDocument, idCompte) VALUES(1, 2);

