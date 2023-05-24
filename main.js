const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath;

    if (req.url === '/' || req.url === '/homepage.html') {
        filePath = path.join(__dirname, 'index/homepage.html');
    } else if (req.url === '/resultpage.html') {
        filePath = path.join(__dirname, 'index/resultpage.html');
    } else {
        res.writeHead(404);
        res.end('Page not found!');
        return;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('An error occurred while loading the file!');
        } else {
            if (filePath.endsWith('.html')) {
                res.setHeader('Content-Type', 'text/html');
            } else if (filePath.endsWith('.js')) {
                res.setHeader('Content-Type', 'application/javascript');
            } else if (filePath.endsWith('.css')) {
                res.setHeader('Content-Type', 'text/css');
            }

            res.writeHead(200);
            res.end(content);
        }
    });
});

const port = 3000;

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
