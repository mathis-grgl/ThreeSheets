// Nombre de colonnes
const numberOfColumns = 26;
// Nombre de lignes
const numberOfRows = 26;

// On récupère le tbody
const tbody = document.querySelector('table#myTable tbody');

// On génère le tableau
for (let i = 0; i < numberOfRows; i++) {
    const row = document.createElement('tr');

    for (let j = 0; j <= numberOfColumns; j++) {
        const cell = (i === 0 && j === 0) ? document.createElement('th') : document.createElement('td');

        if (i === 0 && j !== 0) { // Première ligne avec les lettres
            cell.textContent = String.fromCharCode(65 + j - 1);
            cell.classList.add('table-secondary');
            cell.classList.add('text-center');
        } else if (j === 0 && i !== 0) { // Première colonne avec les chiffres
            cell.textContent = i;
            cell.classList.add('table-secondary');
            cell.classList.add('text-center');
        } else { // Les autres cellules
            cell.contentEditable = false;
        }

        // On assigne un identifiant unique à chaque cellule
        cell.id = `cell_${i}_${j}`;
        cell.style.minWidth = '100px';

        row.appendChild(cell);
    }

    tbody.appendChild(row);
}