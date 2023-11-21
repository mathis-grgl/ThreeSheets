const fileName = document.getElementById('file-name'); // Nom du fichier
const editButton = document.querySelector('.edit-button'); // Bouton d'édition du nom du fichier
let fileNameText = fileName.textContent; // Texte du nom du fichier

// On ecoute le click sur le bouton d'edition du nom du fichier
editButton.addEventListener('click', function() {
    fileName.contentEditable = 'true'; // On active l'édition du nom du fichier
    fileName.focus();
});

// On regarde si on appuie sur la touche entrée ou echap
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        // On désactive l'édition du nom du fichier
        fileName.contentEditable = 'false';
        fileNameText = fileName.textContent; // On récupère le nouveau nom du fichier
    } else if (event.key === 'Escape') {
        // On désactive l'édition du nom du fichier
        fileName.contentEditable = 'false';

        // Annuler les modifications et restaurer l'ancien texte
        fileName.textContent = fileNameText; // Remplacer 'oldText' par le texte d'origine
    }
});


// Écouteurs d'événements pour les boutons de la barre d'outils
document.addEventListener('DOMContentLoaded', function () {
    const boldButton = document.querySelector('.toolbar .btn:nth-of-type(1)');
    const italicButton = document.querySelector('.toolbar .btn:nth-of-type(2)');
    const underlineButton = document.querySelector('.toolbar .btn:nth-of-type(3)');
    const textAlignmentLeftButton = document.querySelector('.toolbar .btn:nth-of-type(4)');
    const textAlignmentCenterButton = document.querySelector('.toolbar .btn:nth-of-type(5)');
    const textAlignmentRightButton = document.querySelector('.toolbar .btn:nth-of-type(6)');
    const backgroundColorText = document.querySelector('.toolbar .btn:nth-of-type(8)');
    const backgroundColorCell = document.querySelector('.toolbar .btn:nth-of-type(7)');


    // On gère le click sur le colorpicker du texte
    backgroundColorText.addEventListener('click', function () {
        backgroundColorText.click();
    });

    // On gère le click sur le colorpicker du fond
    backgroundColorCell.addEventListener('click', function () {
        backgroundColorCell.click();
    });


    // On gere le click sur une cellule
    const cells = document.querySelectorAll('.spreadsheet td[contenteditable="false"]');
    let idCell = 0;

    cells.forEach(cell => {
        let clicks = 0;
        cell.addEventListener('click', function(event) {
            cell.contentEditable = false; // On désactive l'édition de la cellule pour un simple clic
            clicks++;
            if (clicks === 1) {
                setTimeout(function() {
                     // Supprime la classe 'selected-cell' des cellules précédemment sélectionnées
                    const previouslySelectedCells = document.querySelectorAll('.selected-cell');
                    previouslySelectedCells.forEach(prevCell => {
                        prevCell.classList.remove('selected-cell');
                    });

                    if (clicks === 1) {
                        // Sélection simple
                        selectCellContents(event.target);
                    } else {
                        // Double-clic, entrer dans la cellule
                        enterCell(event.target);
                    }
                    clicks = 0;
                }, 250); // Délai pour distinguer le simple-clic du double-clic
            }
        });
    });

    function selectCellContents(cell) {
        // On remet la couleur de fond de la ligne et de la colonne de la cellule cliquée à table-secondary
        let elements = document.querySelectorAll('.table-secondary');
        elements.forEach(element => {
            element.style.backgroundColor = 'lightgray';
        });

        // Ajoute la classe 'selected-cell' à la cellule actuelle
        cell.classList.add('selected-cell');

        // On récupère l'identifiant de la cellule cliquée
        idCell = cell.id;

        const rowIndex = (cell.parentNode.rowIndex) -1; // Indice de colonne de la cellule cliquée
        const columnIndex = cell.cellIndex; // Indice de la colonne de la cellule cliquée
        
        // On change la couleur de fond de la colonne de la cellule cliquée
        document.getElementById("cell_" + rowIndex.toString().replace(/\s/g, "") + "_0").style.backgroundColor = 'lightblue';

        // On change la couleur de fond de la ligne de la cellule cliquée
        document.getElementById("cell_0_" + columnIndex.toString().replace(/\s/g, "")).style.backgroundColor = 'lightblue';
    }

    function enterCell(cell) {
        // On active l'édition de la cellule
        cell.contentEditable = true;
        cell.focus();
    }

    // Gras
    boldButton.addEventListener('click', function () {
        // On récupère la cellule cliquée
        const cell = document.getElementById(idCell);

        // On met en gras la cellule cliquée si elle ne l'est pas sinon on enlève le gras
        (cell.style.fontWeight === 'bold') ? cell.style.fontWeight = 'normal' : cell.style.fontWeight = 'bold';
    });

    //  Italique
    italicButton.addEventListener('click', function () {
        // On récupère la cellule cliquée
        const cell = document.getElementById(idCell);

        // On met en italique la cellule cliquée si elle ne l'est pas sinon on enlève l'italique
        (cell.style.fontStyle === 'italic') ? cell.style.fontStyle = 'normal' : cell.style.fontStyle = 'italic';
    });

    // Souligner
    underlineButton.addEventListener('click', function () {
        // On récupère la cellule cliquée
        const cell = document.getElementById(idCell);

        // On souligne la cellule cliquée si elle ne l'est pas sinon on enlève le soulignement
        (cell.style.textDecoration === 'underline') ? cell.style.textDecoration = 'none' : cell.style.textDecoration = 'underline';
    });

    // Aligner à gauche
    textAlignmentLeftButton.addEventListener('click', function () {
        // On récupère la cellule cliquée
        const cell = document.getElementById(idCell);

        // On aligne à gauche la cellule cliquée si elle ne l'est pas sinon on enlève l'alignement
        if (!cell.classList.contains("text-start")) {
            cell.classList.add("text-start");
            cell.classList.remove("text-center", "text-end");
        }
    });

    // Aligner au centre
    textAlignmentCenterButton.addEventListener('click', function () {
        // On récupère la cellule cliquée
        const cell = document.getElementById(idCell);

        // On aligne au centre la cellule cliquée si elle ne l'est pas sinon on enlève l'alignement
        if (!cell.classList.contains("text-center")) {
            cell.classList.add("text-center");
            cell.classList.remove("text-start", "text-end");
        }
    });

    // Aligner à droite
    textAlignmentRightButton.addEventListener('click', function () {
        // On récupère la cellule cliquée
        const cell = document.getElementById(idCell);

        // On aligne à droite la cellule cliquée si elle ne l'est pas sinon on enlève l'alignement
        if (!cell.classList.contains("text-end")) {
            cell.classList.add("text-end");
            cell.classList.remove("text-start", "text-center");
        }
    });

    // Changer la couleur de fond par rapport au colorpicker
    backgroundColorText.addEventListener('change', function (event) {
        // On récupère la cellule cliquée
        const cell = document.getElementById(idCell);

        // On recupere la couleur selectionnée
        const selectedColor = event.target.value;

        // On change la couleur de fond de la cellule cliquée si elle est blanche sinon on la met en blanc
        (cell.style.backgroundColor != "white") ? cell.style.backgroundColor = selectedColor : cell.style.backgroundColor = "white";
    });

    // Changer la couleur de texte par rapport au colorpicker
    backgroundColorCell.addEventListener('change', function (event) {
        // On récupère la cellule cliquée
        const cell = document.getElementById(idCell);

        // On recupere la couleur selectionnée
        const selectedColor = event.target.value;

        // On change la couleur de fond de la cellule cliquée si elle est blanche sinon on la met en blanc
        (cell.style.color != "white") ? cell.style.color = selectedColor : cell.style.color = "white";
    });
});

/* Créer un nouveau fichier */
function nouveauFichier() {
    // Recharge la page
    window.location.reload();
}

// Ouverture d'un fichier .xlsx avec ExcelJS
async function ouvrirFichier() {
    // On simule un click sur le bouton d'upload de fichier
    document.getElementById('fileInput').click();

    // Écouteur pour le changement de fichier
    document.getElementById('fileInput').addEventListener('change', function (event) {
        // On récupère le fichier
        const file = event.target.files[0];
        
        // On charge le fichier dans notre tableau
        chargerFichier(file);
    });
}

// Charger un fichier .xlsx avec ExcelJS
function chargerFichier(file) {
    // On crée un nouveau lecteur de fichier
    const reader = new FileReader();

    // Lorsque le fichier est chargé
    reader.onload = function (e) {
        // On récupère le contenu du fichier
        const data = new Uint8Array(e.target.result);
        
        // Créer un nouveau classeur ExcelJS
        const workbook = new ExcelJS.Workbook();

        // Charger le fichier Excel
        workbook.xlsx.load(data.buffer)
            .then(() => {
                const fileName = document.getElementById('file-name'); // Nom du fichier
                fileName.textContent = file.name.replace(".xlsx", ""); // On change le nom du fichier
                fileNameText = file.name.replace(".xlsx", ""); // On change le nom du fichier de base

                console.log('Fichier chargé avec ExcelJS');
                
                // On récupère la première feuille du classeur
                const firstSheet = workbook.getWorksheet(1);
                
                 // On parcrout chaque cellule
                 firstSheet.eachRow({ includeEmpty: false }, function (row, rowIndex) {
                    row.eachCell(function (cell, cellIndex) {
                        // On récupère la cellule equivalente à la cellule du fichier XLSX (id => cell_rowIndex_cellIndex )
                        const newCell = document.getElementById("cell_" + (rowIndex).toString().replace(/\s/g, "") + "_" + (cellIndex).toString().replace(/\s/g, ""));

                        // On remplit la cellule avec les styles de la cellule du fichier XLSX correspondante
                        newCell.textContent = cell.value;
                        newCell.style.fontWeight = cell.font.bold ? 'bold' : 'normal';
                        newCell.style.fontStyle = cell.font.italic ? 'italic' : 'normal';
                        newCell.style.textDecoration = cell.font.underline ? 'underline' : 'none';
                        newCell.style.color = cell.font.color ? argbToHex(cell.font.color.argb) : '#000000';
                        newCell.style.backgroundColor = cell.fill.fgColor.argb ? argbToHex(cell.fill.fgColor.argb) : '#FFFFFF';
                        newCell.classList.add(cell.alignment.horizontal === 'center' ? 'text-center' : cell.alignment.horizontal === 'right' ? 'text-end' : 'text-start');
                    });
                });
            })
            .catch(error => {
                console.error('Erreur lors du chargement du fichier avec ExcelJS :', error);
            });
    };

    // Lire le contenu du fichier
    reader.readAsArrayBuffer(file);
}

// Conversion de notre tableau en fichier .xlsx
async function createXLSXFile() {
    return new Promise(async (resolve, reject) => {
        try {
            const workbook = new ExcelJS.Workbook();

            // On crée une feuille de calcul
            const sheet = workbook.addWorksheet('Feuille 1');

            // On récupère le tableau
            const rows = document.querySelectorAll('#myTable tbody tr');

            // On parcourt chaque cellule
            rows.forEach((row, rowIndex) => {
                const cells = row.querySelectorAll('td');
                cells.forEach((cell, cellIndex) => {
                    // On récupère la cellule equivalente à la cellule du fichier XLSX
                    const currentCell = sheet.getCell(rowIndex + 1, cellIndex + 1);

                    // On change le texte de la cellule du fichier XLSX
                    currentCell.value = cell.innerText;

                    // On change la police de la cellule du fichier XLSX
                    currentCell.font = {
                        name: 'Arial',
                        size: 12,
                        color: { argb: (cell.style.color != "") ? rgbToHex(cell.style.color.toString()) : "FF000000" }, // si vide => Noir
                        bold: cell.style.fontWeight === 'bold',
                        italic: cell.style.fontStyle === 'italic',
                        underline: cell.style.textDecoration === 'underline'
                    };

                    // On change l'alignement du texte de la cellule du fichier XLSX
                    currentCell.alignment = {
                        vertical: 'middle',
                        horizontal: cell.classList.contains('text-center') ? 'center' : cell.classList.contains('text-end') ? 'right' : 'left'
                    };

                    // On change la couleur de fond de la cellule si elle n'est pas blanche sinon on la met en blanc dans le fichier XLSX
                    currentCell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: (cell.style.backgroundColor != "") ? rgbToHex(cell.style.backgroundColor.toString()) : "FFFFFFFF" }, // si vide => Blanc
                    };
                });
            });

            // On met le fichier dans un buffer et on le convertit en blob
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            resolve(blob);
        } catch (error) {
            reject(error);
        }
    });
}

/* Enregistre le fichier en format .xlsx */
async function telechargerFichier() {
    // On crée le fichier
    const blob = await createXLSXFile();
    
    // On enregistre le fichier sur notre pc
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileNameText,'.xlsx'; // Nom du fichier
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

async function enregistrerFichier(){
    // On crée le fichier et on l'enregistre sur le serveur
    const blob = await createXLSXFile();

    // On enregistre le fichier sur le serveur
    enregistrerSurServeur(blob);
}


/* Ferme le fichier et redirige vers le dashboard */
async function fermerFichier(){
    // On crée le fichier et on l'enregistre sur le serveur
    const buffer = await createXLSXFile();

    // On enregistre le fichier sur le serveur
    //enregistrerSurServeur(buffer); // marche pas car reecrée un meme fichier

    window.location.href = "/dashboard";
}


// Enregistre le fichier sur le serveur
async function enregistrerSurServeur(blob) {
    try {
        // On crée un objet FormData avec le fichier xlsx
        const formData = new FormData();
        formData.append('file', blob, fileNameText+'.xlsx');

        // Envoi du fichier au serveur
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log('Fichier enregistré sur le serveur !');

            // On récupère l'id du créateur
            const idCreateur = document.getElementById('idCreateur').value;

            // On récupère le titre du document
            const titre = document.getElementById('file-name').textContent;

            // On crée le document dans la db
            await createDocumentInDb(titre, idCreateur);
        } else {
            console.error('Erreur lors de l\'enregistrement du fichier sur le serveur.   Fichier : ', fileNameText+ ".xlsx");
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi du fichier au serveur :', error);
    }
}

// Crée un document dans la base de données
async function createDocumentInDb(titre, idCreateur) {
    const requestData = {
        titre: titre,
        idCreateur: idCreateur
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    };

    try {
        const response = await fetch('/create', requestOptions);
        if (!response.ok) {
            throw new Error('Erreur lors de la création du document');
        }
        const responseData = await response.text();
        console.log(responseData); // Afficher la réponse du serveur
    } catch (error) {
        console.error(error);
    }
}

// On récupère le nom du fichier par son id
async function loadNameFile() {
    // On récupère l'id du document dans l'url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const idDocument = urlParams.get('idDocument');

    // On récupère le titre du document si il y a un id en paramètre
    if (idDocument) {
        try {
            const response = await fetch(`/getFileById/${idDocument}`);
            if (!response.ok) {
                throw new Error('Erreur de réseau');
            }

            // Récupération des données JSON renvoyées par le serveur
            const data = await response.json();
            const titre = data.titre;
            const url = `/files/${titre}.xlsx`;

            // Effectuer une requête pour récupérer le fichier
            const fileResponse = await fetch(url);
            if (!fileResponse.ok) {
                throw new Error('Erreur lors de la récupération du fichier');
            }

            // Récupération du blob
            const blob = await fileResponse.blob();
            const file = new File([blob], titre + '.xlsx', { type: blob.type });
            
            // Appel de la fonction pour charger le fichier
            chargerFichier(file);

            // Affichage du titre du document
            const titreElement = document.getElementById('file-name');
            titreElement.textContent = titre;
        } catch (error) {
            console.error(error); // Gestion des erreurs
        }
    }
}

// Convertit une valeur de couleur ARGB en hexadécimal
function argbToHex(argbValue) {
    // On extrait les valeurs de rouge, vert et bleu de l'ARGB
    const red = parseInt(argbValue.substr(2, 2), 16);
    const green = parseInt(argbValue.substr(4, 2), 16);
    const blue = parseInt(argbValue.substr(6, 2), 16);

    // On combine les valeurs RVB pour obtenir une couleur hexadécimale
    const hexColor = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
    return hexColor;
}

// Convertit une valeur de couleur RGB en hexadécimal
function rgbToHex(rgb) {
    // Sépare les valeurs de couleur (R, G, B) de la chaîne rgb()
    const [r, g, b] = rgb.match(/\d+/g);

    // Convertit les valeurs de couleur en hexadécimal
    const hex = `FF${(+r).toString(16).padStart(2, '0')}${(+g).toString(16).padStart(2, '0')}${(+b).toString(16).padStart(2, '0')}`;

    return hex.toUpperCase(); // Retourne la valeur en majuscules
}