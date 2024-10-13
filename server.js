const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors'); 

const app = express();


app.use(express.json());
app.use(cors()); 

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__data.ejs, 'views'));

dotenv.config();



const connection = mysql.createConnection({
    host: process.env.DB_HOST,  
    user: process.env.DB_USERNAME, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database with thread ID:', connection.threadId);
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

// 3. Filter patients by First Name
app.get('/patients/by-name', (req, res) => {
    const firstName = req.query.first_name;

    if (!firstName) {
        return res.status(400).json({ error: 'First name is required' });
    }

    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    connection.query(query, [firstName], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/by-specialty', (req, res) => {
    const specialty = req.query.specialty;

    if (!specialty) {
        return res.status(400).json({ error: 'Specialty is required' });
    }

    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    connection.query(query, [specialty], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

// Listen to the server
const PORT = process.env.PORT ;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});