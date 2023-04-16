const {Pool} = require('pg');

let postgreClient ;

async function MakeConnectionToPostgreSQL() {
  try {
    postgreClient = new Pool({
      connectionString: process.env.POSTGRE_SQL_CONFIG,
      ssl: {
        rejectUnauthorized: false
      }
    });
    await postgreClient.connect();
    console.log('Connected to PostgreSQL database');
  } catch (err) {
    console.log('Failed to connect to PostgreSQL database:', err.message);
  }
}

function getPostgreSQLClient(){
  return postgreClient ;
}

async function LoadTablesFromDB(){
  try {
    const res = await postgreClient.query(`
      CREATE TABLE IF NOT EXISTS episodes (
        episode_id SERIAL PRIMARY KEY ,
        episode_name VARCHAR(255),
        episode_url VARCHAR(400)
      );
    `);
    console.log("Table Created Successfully");
  } catch (err) {
    console.error('Error while creating table:', err.message);
  }
}


module.exports = {
  MakeConnectionToPostgreSQL,
  LoadTablesFromDB,
  getPostgreSQLClient
}
