function changeFavicon(path) {
    var link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = path;
    document.head.appendChild(link);
}

// Utilisez la fonction pour changer le favicon
changeFavicon('public/picture/favicon.png');
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath;

    // Vérifier l'URL demandée et définir le chemin du fichier en conséquence
    if (req.url === '/' || req.url === '/homepage.html') {
        filePath = path.join(__dirname, 'homepage.html');
    } else if (req.url === '/resultpage.html') {
        filePath = path.join(__dirname, 'resultpage.html');
    } else {
        // Si l'URL demandée ne correspond à aucun des fichiers spécifiés, retourner une erreur 404
        res.writeHead(404);
        res.end('Page not found!');
        return;
    }

    // Lire le fichier correspondant au chemin spécifié
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // En cas d'erreur lors de la lecture du fichier, retourner une erreur 500
            res.writeHead(500);
            res.end('An error occurred while loading the file!');
        } else {
            // Définir l'en-tête de la réponse avec le type de contenu approprié
            if (filePath.endsWith('.html')) {
                res.setHeader('Content-Type', 'text/html');
            } else if (filePath.endsWith('.js')) {
                res.setHeader('Content-Type', 'application/javascript');
            } else if (filePath.endsWith('.css')) {
                res.setHeader('Content-Type', 'text/css');
            }

            // Envoyer le contenu du fichier en réponse
            res.writeHead(200);
            res.end(content);
        }
    });
});

const port = 3000;

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
