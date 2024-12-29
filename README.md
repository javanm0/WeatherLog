# Weather Log Server
This logging server has an API POST request to accept data from a weather sensor. The data is then stored in an Azure SQL database.

The logged data can be retrieved by the Azure SQL database with the API GET request at the /data endpoint.

## Configuration Settings
### Environment Variables 
The connection to the Azure SQL database can be configured in an .env file
1. Rename the .env.example file as .env
2. Configure the port as well as all of the Azure SQL database settings

### Azure SQL Database
The database can be created with the following commands
1. `CREATE DATABASE WeatherLogDB;`
2. `USE WeatherLogDB;`
3. `CREATE TABLE weather (`  
    `id INT PRIMARY KEY IDENTITY(1,1),  `  
    `temperature FLOAT NOT NULL,`  
    `humidity FLOAT NOT NULL,`  
    `logtime DATETIME NOT NULL`  
`);`  

## Live Demo
### Frontend Server
[https://weather.javanmiller.com](https://weather.javanmiller.com)

### Backend Server
[https://api.weather.javanmiller.com](https://api.weather.javanmiller.com)

