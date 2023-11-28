// On établi une connexion Socket.IO avec le serveur pour la mise à jour en temps réel
let socket = io() // Connexion au serveur Socket.IO

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
    console.log("Infos : ",data.connectedUsers);
    afficherUtilisateurs(data.connectedUsers);
});

// On écoute les événements d'un utilisateur qui quitte
socket.on('leavingUser', (data) => {
    afficherToast("L'utilisateur " + data.userId + " vient de se déconnecter", 'danger');
    afficherUtilisateurs(data.connectedUsers);
});

// On envoie un événement au serveur pour signaler la déconnexion d'un utilisateur quand il quitte la page ou navigue en arrière
window.addEventListener('beforeunload', function() {
    // Déconnexion du socket lorsque l'utilisateur quitte la page ou navigue en arrière
    socket.emit('leave', document.getElementById('idCreateur').value);
    socket.disconnect();
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
                            <p style="font-size: 28px;">${user.pseudo}</p>
                            <button class="btn btn-primary" onclick="retirerAcces(${user.idCompte})">Retirer l'accès</button>
                        </div>
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
async function retirerAcces(id){
    /*return fetch('/deleteUserInDocument/'+id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau');
            }
            return response.json(); // Récupération des données de session au format JSON
        });*/
}