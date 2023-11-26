// Initialise les popovers Bootstrap pour afficher des infos sur des utilisateurs
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})

// Gérer ici tout ce qui concerne les utilisateurs, modifs, suppression, etc. peut etre mettre aussi le long polling
// On set l'id du créateur dans la feuille de calcul
async function setIdCreateur() {
    // On récupère l'id du créateur
    getIdCreateur()
    .then(data => {
        // On récupère l'idCreateur
        const idCreateur = document.getElementById('idCreateur');

        // On set l'id du créateur dans la feuille de calcul
        idCreateur.value = data.idCreateur.idCompte;
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