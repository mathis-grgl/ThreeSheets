// Initialise les popovers Bootstrap pour afficher des infos sur des utilisateurs
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})

// On établi une connexion Socket.IO avec le serveur pour la mise à jour en temps réel
const socket = io() // Connexion au serveur Socket.IO

// On envoie un événement au serveur pour signaler la déconnexion d'un utilisateur
socket.on('deconnect', () => {
    socket.emit('leave', document.getElementById('idCreateur').value);
});

// On écoute les événements de connexion d'un utilisateur
socket.on('newUser', (data) => {
    afficherToast("L'utilisateur " + data.userId + "vient de se connecter", 'success');
    console.log("Infos : ",data.connectedUsers);
    afficherUtilisateurs(data.connectedUsers);
});

// On écoute les événements d'un utilisateur qui quitte
socket.on('leavingUser', (data) => {
    afficherToast("L'utilisateur " + data.userId + "vient de se déconnecter", 'danger');
    afficherUtilisateurs(data.connectedUsers);
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
    listeUtilisateurs.innerHTML = `<i class="bi bi-people"></i>`; // On affiche l'icône des utilisateurs

    // Convertir l'ensemble en tableau avec Array.from()
    console.log("Liste ",listeId);
    const idArray = Array.from(listeId);   
    console.log("Array ",idArray);

    // On récupère les utilisateurs connectés en parcourant la liste des id
    idArray.forEach(async Element => {
        // On récupère l'utilisateur
        let user = await getUserById(Element);
        user = user.user;
        const initiale = String(user.pseudo.charAt(0)).toUpperCase(); // Première lettre du pseudo de l'utilisateur connecté
        console.log("Utilisateur : " + user.pseudo + " (" + user.email + ")" + " (" + user.idCompte + ")" + " (" + initiale + ")");

        // On génère le contenu HTML du bouton
        let content = 
        `<button id="${user.idCompte}" class="btn-account" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
            <span data-bs-html="true" data-bs-toggle="popover" data-bs-placement="bottom" title="Informations"
                data-bs-content='${user.pseudo}<br>${user.email}'>${initiale}</span>
        </button>`;

        // On rajoute l'utilisateur connecté dans l'html
        listeUtilisateurs.innerHTML += content;
    });
}