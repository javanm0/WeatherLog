require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const server = express();
const port = process.env.PORT;
const apiKey = process.env.API_KEY;

server.use(cors());
server.use(express.json());

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

sql.connect(config).then(pool => {
    if (pool.connected) {
        console.log('Connected to Azure SQL');
    }

    server.post('/api', async function (req, res) {
        const temperature = req.body.temperature;
        const humidity = req.body.humidity;
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const receivedAPIKey = req.body.apiKey;

        if (receivedAPIKey !== apiKey) {
            console.error('Invalid authentication');
            console.log('Received API Key: ' + receivedAPIKey);
            res.status(401).send('Invalid authentication');
            return;
        }

        console.log('Temperature: ' + temperature);
        console.log('Humidity: ' + humidity);
        console.log('Current Date Time: ' + currentDateTime);

        const query = 'INSERT INTO weather (temperature, humidity, logtime) VALUES (@temperature, @humidity, @logtime)';
        try {
            await pool.request()
                .input('temperature', sql.Float, temperature)
                .input('humidity', sql.Float, humidity)
                .input('logtime', sql.DateTime, currentDateTime)
                .query(query);
            res.status(200).send('Inserted into Azure SQL');
        } catch (err) {
            console.error('Error inserting into Azure SQL: ' + err.stack);
            res.status(500).send('Error inserting into Azure SQL: ' + err.stack);
        }
    });

    server.get('/data', async function (req, res) {
        const query = 'SELECT TOP 3600 temperature, humidity, logtime FROM weather ORDER BY logtime DESC';
        try {
            const result = await pool.request().query(query);
            res.json(result.recordset);
        } catch (err) {
            console.error('Error fetching data from Azure SQL: ' + err.stack);
            res.status(500).send('Error fetching data from Azure SQL: ' + err.stack);
        }
    });

    server.listen(port, function () {
        console.log('Listening on ' + port);
    });
}).catch(err => {
    console.error('Error connecting to Azure SQL: ' + err.stack);
});