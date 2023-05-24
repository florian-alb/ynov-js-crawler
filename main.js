function changeFavicon(path) {
    var link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = path;
    document.head.appendChild(link);
}

// Utilisez la fonction pour changer le favicon
changeFavicon('public/picture/favicon.png');
