function changeFavicon(path) {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = path;
    document.head.appendChild(link);
}
