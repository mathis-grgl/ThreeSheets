

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
        console.log("v index : " + rowIndex + " -> index : " + columnIndex);
    }

    function enterCell(cell) {
        // On active l'édition de la cellule
        cell.contentEditable = true;
        cell.focus();
    }

    // Gras
    boldButton.addEventListener('click', function () {
        console.log(idCell);
        // On met en gras la cellule cliquée si elle ne l'est pas sinon on enlève le gras
        if (document.getElementById(idCell).style.fontWeight === 'bold') {
            document.getElementById(idCell).style.fontWeight = 'normal';
        } else {
            document.getElementById(idCell).style.fontWeight = 'bold';
        }
    });

    //  Italique
    italicButton.addEventListener('click', function () {
        // On met en italique la cellule cliquée si elle ne l'est pas sinon on enlève l'italique
        if (document.getElementById(idCell).style.fontStyle === 'italic') {
            document.getElementById(idCell).style.fontStyle = 'normal';
        } else {
            document.getElementById(idCell).style.fontStyle = 'italic';
        }
    });

    // Souligner
    underlineButton.addEventListener('click', function () {
        // On souligne la cellule cliquée si elle ne l'est pas sinon on enlève le soulignement
        if (document.getElementById(idCell).style.textDecoration === 'underline') {
            document.getElementById(idCell).style.textDecoration = 'none';
        } else {
            document.getElementById(idCell).style.textDecoration = 'underline';
        }
    });

    // Aligner à gauche
    textAlignmentLeftButton.addEventListener('click', function () {
        const cell = document.getElementById(idCell);
        if (!cell.classList.contains("text-start")) {
            cell.classList.add("text-start");
            cell.classList.remove("text-center", "text-end");
        }
    });

    // Aligner au centre
    textAlignmentCenterButton.addEventListener('click', function () {
        const cell = document.getElementById(idCell);
        if (!cell.classList.contains("text-center")) {
            cell.classList.add("text-center");
            cell.classList.remove("text-start", "text-end");
        }
    });

    // Aligner à droite
    textAlignmentRightButton.addEventListener('click', function () {
        const cell = document.getElementById(idCell);
        if (!cell.classList.contains("text-end")) {
            cell.classList.add("text-end");
            cell.classList.remove("text-start", "text-center");
        }
    });

    // Changer la couleur de fond par rapport au colorpicker
    backgroundColorText.addEventListener('change', function (event) {
        const selectedColor = event.target.value;

        // On change la couleur de fond de la cellule cliquée si elle est blanche sinon on la met en blanc
        if (document.getElementById(idCell).style.backgroundColor != "white") {
            document.getElementById(idCell).style.backgroundColor = selectedColor;
        } else {
            document.getElementById(idCell).style.backgroundColor = 'white';
        }
    });

    // Changer la couleur de texte par rapport au colorpicker
    backgroundColorCell.addEventListener('change', function (event) {
        const selectedColor = event.target.value;

        // On change la couleur de fond de la cellule cliquée si elle est blanche sinon on la met en blanc
        if (document.getElementById(idCell).style.color != "white") {
            document.getElementById(idCell).style.color = selectedColor;
        } else {
            document.getElementById(idCell).style.color = 'white';
        }
    });
});

/* Créer un nouveau fichier */
function nouveauFichier() {

    // Recharge la page
    window.location.reload();
}

/* Ouvrir un fichier (non implémenté) */
function ouvrirFichier() {
}

/* Enregistre le fichier en format .xlsx (Enregistre mais avec les chiffres et les lettres) */
function enregistrerFichier(){

    // On récupère le tableau
    const table = document.getElementById('myTable');
    console.log(table);

    // On crée une copie du tableau
    const tableCopy = table.cloneNode(true);

    // On convertit le tableau en feuille de calcul
    const ws = XLSX.utils.table_to_sheet(table, {cellStyles: true});

    // On crée un nouveau fichier de classeur
    const wb = XLSX.utils.book_new();

    // On ajoute la feuille de calcul au classeur
    XLSX.utils.book_append_sheet(wb, ws, "Feuille 1");

    // On télécharge le fichier
    XLSX.writeFile(wb, 'table.xlsx');
}

/* Ferme le fichier et redirige vers le dashboard */
function fermerFichier(){
    window.location.href = "/dashboard";
}