const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Start the clangd process
const clangd = spawn('clangd', ['--background-index']);

clangd.stdout.on('data', (data) => {
    console.log(`clangd: ${data}`);
});

clangd.stderr.on('data', (data) => {
    console.error(`clangd error: ${data}`);
});

clangd.on('close', (code) => {
    console.log(`clangd exited with code ${code}`);
});

app.post('/lsp', (req, res) => {
    const lspMessage = JSON.stringify(req.body);
    clangd.stdin.write(lspMessage + '\n');

    clangd.stdout.once('data', (data) => {
        res.json(JSON.parse(data.toString()));
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
