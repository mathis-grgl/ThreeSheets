// On établi une connexion Socket.IO avec le serveur pour la mise à jour en temps réel
let socket = io() // Connexion au serveur Socket.IO

// Récupération du bouton "Partager"
const btnPartager = document.getElementById('partager');

// Fonction pour afficher le pop-up en attente
function afficherPopUpAttente() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block'; // Affichage du pop-up d'attente
}
  
// À utiliser pour masquer le pop-up une fois la tâche terminée
function cacherPopUpAttente() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none'; // Masquer le pop-up d'attente
}

// On affiche le pop-up d'attente au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    afficherPopUpAttente(); // Affichage du pop-up d'attente
});

// On écoute les événements de connexion d'un utilisateur au chargement de la page
window.addEventListener('pageshow', (event) => {
    socket = io();
    socket.emit('join', document.getElementById('idCreateur').value);
  
    afficherUtilisateurs();
    cacherPopUpAttente(); // Masquer le pop-up d'attente
});
  
// On envoie un événement au serveur pour signaler la déconnexion d'un utilisateur
socket.on('deconnect', () => {
    socket.emit('leave', document.getElementById('idCreateur').value);
});

// On écoute les événements de connexion d'un utilisateur
socket.on('newUser', (data) => {
    afficherToast("L'utilisateur " + data.userId + " vient de se connecter", 'success');

    // On affiche les utilisateurs connectés
    afficherUtilisateurs(data.connectedUsers);
});

// On écoute les événements d'un utilisateur qui quitte
socket.on('leavingUser', (data) => {
    if (data.userId != document.getElementById('idCreateur').value) {
        afficherToast("L'utilisateur " + data.userId + " vient de se déconnecter", 'danger');
        afficherUtilisateurs(data.connectedUsers);
    } else {
        // on redirige vers le dashboard
        window.location.href = "/dashboard"; // Probleme ca redirige aussi si on fait f5 sur la page et donc ca deco l'utilisateur qui degage un autre utilisateur
    }
});

// On envoie un événement au serveur pour signaler la déconnexion d'un utilisateur quand il quitte la page ou navigue en arrière
window.addEventListener('beforeunload', function() {
    // Déconnexion du socket lorsque l'utilisateur quitte la page ou navigue en arrière
    socket.emit('leave', document.getElementById('idCreateur').value);
    socket.disconnect();
});

// Écouteur d'événement pour le clic sur le bouton "Partager"
btnPartager.addEventListener('click', async () => {
    try {
        const users = await getAllUsers(); // Récupération de la liste des utilisateurs

        // Récupération du conteneur de la fenêtre modale
        const modalBody = document.getElementById('modalBody');

        // Effacer le contenu actuel de la fenêtre modale
        modalBody.innerHTML = '';

        // Générer les lignes pour chaque utilisateur et les ajouter à la fenêtre modale
        users.forEach(user => {
            // Création d'une div pour chaque utilisateur
            const userDiv = document.createElement('div');
            userDiv.classList.add('user-row'); // Ajouter une classe pour le style

            // Pseudo à gauche
            const pseudoDiv = document.createElement('div');
            pseudoDiv.textContent = user.pseudo;
            pseudoDiv.classList.add('user-column'); // Ajouter une classe pour le style
            userDiv.appendChild(pseudoDiv);

            // Email au milieu
            const emailDiv = document.createElement('div');
            emailDiv.textContent = user.email;
            emailDiv.classList.add('user-column'); // Ajouter une classe pour le style
            userDiv.appendChild(emailDiv);

            // Bouton "Partager" à droite
            const shareButton = document.createElement('button');
            shareButton.classList.add('btn');
            shareButton.classList.add('btn-primary');
            shareButton.textContent = 'Partager';

            // Ajouter un écouteur d'événement pour le clic sur le bouton "Partager"
            shareButton.addEventListener('click', () => {
                console.log(`Partager avec ${user.pseudo}`);
                donnerAcces(user.idCompte); // Donner l'accès à l'utilisateur
            });

            // Ajouter le bouton "Partager" à la div
            const shareDiv = document.createElement('div');
            shareDiv.classList.add('user-column');
            shareDiv.appendChild(shareButton);
            userDiv.appendChild(shareDiv);

            // Ajouter la div à la fenêtre modale
            modalBody.appendChild(userDiv);
        });
    } catch (error) {
        // Gestion des erreurs
        console.error(error);
    }
});


// On set l'id du créateur dans la feuille de calcul
async function setIdCreateur() {
    // On récupère l'id du créateur
    getIdCreateur()
    .then(data => {
        // On récupère l'idCreateur
        const idCreateur = document.getElementById('idCreateur');

        // On set l'id du créateur dans la feuille de calcul
        idCreateur.value = data.idCreateur.idCompte;

        // On notifie le serveur de la connexion d'un utilisateur
        socket.emit('join', document.getElementById('idCreateur').value);
    })
    .catch(error => {
        console.error(error); // Gestion des erreurs
    });

}

// On récupère l'id du créateur
async function getIdCreateur(){
    return fetch('/getIdCreateur')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau');
            }
            return response.json(); // Récupération des données de session au format JSON
        });
}

// On récupère l'id du créateur
async function getUserById(id){
    return fetch('/getUserById/'+id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau');
            }
            return response.json(); // Récupération des données de session au format JSON
        });
}

// On récupère l'utilisateur connecté
async function getUtilisateurConnecte(){
    return fetch('/getUser')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau');
            }
            return response.json(); // Récupération des données de session au format JSON
        });
}

// On récupère tous les utilisateurs et on les affiche
async function afficherUtilisateurs(listeId){
    // On vide la liste des utilisateurs
    let listeUtilisateurs = document.getElementById('utilisateurs');
    listeUtilisateurs.innerHTML = `<div class="icon-container"><i class="bi bi-people"></i></div>`; // On affiche l'icône des utilisateurs

    // On vérifie si la liste des id est définie
    if (listeId != undefined) {
        // Convertir l'ensemble en tableau avec Array.from()
        const idArray = Array.from(listeId);   

        // On récupère les utilisateurs connectés en parcourant la liste des id
        idArray.forEach(async Element => {
            // On vérifie si l'id n'est pas vide
            if (Element != "") {
                console.log("Id : " + Element);
                // On récupère l'utilisateur
                let user = await getUserById(Element);
                user = user.user;
                const initiale = String(user.pseudo.charAt(0)).toUpperCase(); // Première lettre du pseudo de l'utilisateur connecté
                console.log("Utilisateur : " + user.pseudo + " (" + user.email + ")" + " (" + user.idCompte + ")" + " (" + initiale + ")");

                // On génère le contenu HTML du bouton
                let content = 
                `<div class="user-container">
                    <button onclick="afficherInfosUser(${user.idCompte})" id="account-${user.idCompte}" class="btn-account" type="button" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Informations">
                        <span class="initials">${initiale}</span>
                    </button>
                    <div id="popover-content-${user.idCompte}" class="d-none">
                        <div class="popover-content">
                            <p>${user.email}</p>
                            <div class="circle">${initiale}</div>
                            <p style="font-size: 28px;">${user.pseudo}</p>`

                            // On retire la possibilité de se retirer l'accès à soi-même
                            if (user.idCompte != document.getElementById('idCreateur').value) {
                                content += `<button class="btn btn-primary" onclick="retirerAcces(${user.idCompte})">Retirer l'accès</button>`
                            }

                        content += 
                        `</div>
                    </div>
                </div>`;

                // On rajoute l'utilisateur connecté dans l'html
                listeUtilisateurs.innerHTML += content;
            }
        });
    }
}

// Fonction pour afficher un pop-up d'information sur un utilisateur
function afficherInfosUser(idCompte) {
    const popover = document.getElementById(`popover-content-${idCompte}`);

    // On affiche le popover
    popover.classList.toggle('d-none');
}

// On retire l'accès à un utilisateur
async function retirerAcces(idCompte){
    // On récupère l'id du document dans l'url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const idDocument = urlParams.get('idDocument');

    // On retire l'accès à l'utilisateur
    return fetch('/removeShare/'+ idDocument + '/' + idCompte)
        .then(response => {
            if (!response.ok) {
                // On affiche un message d"erreur"
                afficherToast("L'utilisateur " + idCompte + " n'a pas été retiré", 'danger');

                throw new Error('Erreur de réseau');
            }

            // On affiche un message de succès
            afficherToast("L'utilisateur " + idCompte + " a bien été retiré", 'success');

            // On notifie le serveur d'un changement dans un document
            socket.emit('changeDocument');

            // On notifie le serveur de la déconnexion d'un utilisateur
            socket.emit('leave', idCompte);
        });
}

// On donne l'accès à un utilisateur
async function donnerAcces(idCompte){
    // On récupère l'id du document dans l'url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const idDocument = urlParams.get('idDocument');

    // On vérifie si l'id du document est défini sinon on affiche un message d'erreur
    if (idDocument != null) {
        return await fetch('/shareDocument/' + idDocument + '/' + idCompte)
            .then(response => {
                if (!response.ok) {
                    // On affiche un message d"erreur"
                    afficherToast("L'utilisateur " + idCompte + " n'a pas été ajouté", 'danger');

                    throw new Error('Erreur de réseau');
                }

                // On affiche un message de succès
                afficherToast("L'utilisateur " + idCompte + " a bien été ajouté", 'success');

                // On notifie le serveur d'un changement dans un document
                socket.emit('changeDocument');
            });
    } else {
        // On affiche un message d"erreur"
        afficherToast("Veuillez ajouter un utilisateur sur un document existant", 'danger');
    }
}

// On récupère tous les utilisateurs
async function getAllUsers(){
    return fetch('/getAllUsers')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau');
            }
            return response.json(); // Récupération des données de session au format JSON
        });
}