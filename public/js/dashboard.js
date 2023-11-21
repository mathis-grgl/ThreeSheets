// Fonction pour récupérer et afficher tous les documents
async function afficherDocuments() {
    try {
        // Récupération de tous les documents
        const response = await fetch('/getAll');
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des documents');
        }

        // Conversion de la réponse en JSON
        const documents = await response.json();

        // On récupère la balise qui contiendra les documents
        const fichiersContainer = document.querySelector('.fichiers-existants');
        fichiersContainer.innerHTML = ''; // Pour vider le contenu existant

        // On parcourt tous les documents
        documents.forEach((doc) => {
            // On génère le div global
            const newDiv = document.createElement('div');
            newDiv.classList.add('btn-new');

            // On génère l'icône
            const iconImg = document.createElement('img');
            iconImg.src = '/img/icon.png'; // Choisir l'icône appropriée
            iconImg.alt = '';
            iconImg.classList.add('btn-icon');
            iconImg.onclick = () => window.location.href = `/feuille/?idDocument=${doc.idDocument}`; // Rediriger vers la page du document

            // On génère le span pour le texte
            const spanText = document.createElement('span');
            spanText.classList.add('btn-text');
            spanText.textContent = doc.titre; // Utiliser le titre du document

            // On génère l'icône pour supprimer le document
            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add('delete-icon');
            deleteIcon.textContent = '❌';
            deleteIcon.onclick = () => supprimerDocument(doc.idDocument); // Fonction pour supprimer le document

            // On ajoute les éléments au div global
            newDiv.appendChild(iconImg);
            newDiv.appendChild(spanText);
            newDiv.appendChild(deleteIcon);
            fichiersContainer.appendChild(newDiv);
        });
    } catch (error) {
        console.error(error);
    }
}

// Fonction pour supprimer un document et le .xlsx associé
async function supprimerDocument(idDocument) {
    try {
        // Suppression du fichier .xlsx du serveur et du document dans la base de données
        const response = await fetch(`/delete/${idDocument}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du document');
        }
        afficherDocuments(); // Actualiser la liste des documents après la suppression
    } catch (error) {
        console.error(error);
    }
}