const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Percorso del file JSON contenente le credenziali
const credentialsFile = 'credentials.json';

// Funzione per autenticare le credenziali
function authenticate(username, password) {
    const credentials = JSON.parse(fs.readFileSync(credentialsFile, 'utf8'));
    return credentials[username] === password;
}

// Funzione per registrare nuove credenziali
function register(username, password) {
    const credentials = JSON.parse(fs.readFileSync(credentialsFile, 'utf8'));
    credentials[username] = password;
    fs.writeFileSync(credentialsFile, JSON.stringify(credentials, null, 2), 'utf8');
}

// Pagina di login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/login.html'));
});

// Gestione del login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (authenticate(username, password)) {
        // Reindirizza alla pagina App_GrantedUser se il login ha successo
        res.redirect('/App_GrantedUser');
    } else {
        // Reindirizza alla pagina notPermission se il login non ha successo
        res.redirect('/notPermission.html');
    }
});

// Pagina di registrazione
app.get('/registert', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/registert.html'));
});

// Gestione della registrazione
app.post('/registert', (req, res) => {
    // Estrai i dati dal corpo della richiesta
    const { username, password } = req.body;

    // Verifica se l'utente è già registrato
    if (authenticate(username, password)) {
        // Reindirizza alla pagina di registrazione se l'utente esiste già
        res.redirect('/registert.html');
    } else {
        // Registra le nuove credenziali
        register(username, password);
        // Reindirizza alla pagina di login dopo la registrazione
        res.redirect('/');
    }
});

// Pagina per gli utenti autorizzati
app.get('/App_GrantedUser', (req, res) => {
    // Qui puoi renderizzare la pagina App_GrantedUser.ejs e passare le informazioni dell'utente
    res.send('Benvenuto! Hai accesso alla pagina riservata.');
});

// Pagina di permesso negato
app.get('/notPermission.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notPermission.html'));
});

// Avvia il server
app.listen(PORT, () => {
    console.log(`Server avviato sulla porta ${PORT}`);
});
