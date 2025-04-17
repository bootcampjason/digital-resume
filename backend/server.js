// Writes server.js in plain NodeJS

const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = 3000;
require('dotenv').config();
console.log(`Running ${process.env.NODE_ENV}`);

if (process.env.DEBUG === 'true') {
  console.log('Debug mode is ON 🔍');
}

const od = "3";
const aboutPage = fs.readFileSync("./public/about.html");
const error404 = fs.readFileSync("./public/404.html");

const server = http.createServer((req, res) => {
  // Route: /about - serve about.html
  const endpoint = req.url;
  const method = req.method;

	if (endpoint === "/" && method === "GET") {
    res.writeHead(200, {
      "content-type": "text/html",
    });

    res.end('Welcome to main page');
  }

  else if (endpoint === "/about" && method === "GET") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
		const filePath = path.join(__dirname, 'public', 'about.html');
		fs.readFile(filePath, (err, data) => {
			if (err) {
				res.writeHead(500);
				res.end('server Error');
				return;
			}
			res.end(data);
		});

    res.write("About Page");
    res.end(aboutPage);
  }

	// Route: /form - Serve form.html
	else if (endpoint === '/form' && method === 'GET') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		const filePath = path.join(__dirname, 'public', 'form.html');
		fs.readFile(filePath, (err, formPage) => {
			if (err) {
				res.writeHead(500);
				res.end('Server Error');
				return;
			}
			res.end(formPage);
		});
	}

	// Route: /submit - Handle POST data
	else if (endpoint === '/submit' && method === 'POST') {
		let body = '';
		
		// Collect data chunks
		req.on('data', chunk => {
			body += chunk;
		});

		// Process the complete data
		req.on('end', () => {
			// Parse the URL-encoded form data
			const parsedData = new URLSearchParams(body);
			const name = parsedData.get('name');
			const age = parsedData.get('age');

			res.writeHead(201, { 'Content-Type': 'text/plain' });
			res.end(`Received: Name - ${name}, Age - ${age}`);
		});
	}
	
  else {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('404 Page Not Found');
  }
  // else {
  //     console.log('wrong url');
  //     // res.writeHead(404, {
  //     //     'content-type': 'text/plain'
  //     // });
  //     // res.write('Page Not Found');
  //     res.end('/')
  // }
});

server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
