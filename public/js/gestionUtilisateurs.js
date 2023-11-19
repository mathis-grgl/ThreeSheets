// Initialise les popovers Bootstrap pour afficher des infos sur des utilisateurs
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})

// Gérer ici tout ce qui concerne les utilisateurs, modifs, suppression, etc. peut etre mettre aussi le long polling