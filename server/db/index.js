
const { Client } = require('pg')
require('dotenv').config();

const client = new Client()

// Connect to the PostgreSQL database
client.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Error connecting to the database', err));

  module.exports = client;
