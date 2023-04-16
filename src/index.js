const express =  require('express');
const cors = require('cors');
const {router} = require('./routes/episode-router');

const { MakeConnectionToPostgreSQL, 
        LoadTablesFromDB } = require('./postgresql.js');

require('dotenv').config();

const PORT = process.env.PORT || 4000;

const app = express() ; 

app.use(cors({
    origin : '*'
}));
app.use(express.json());
app.use('/api/v1',router);

app.listen(PORT,async ()=>{
    await MakeConnectionToPostgreSQL();
    await LoadTablesFromDB();
    console.log("Server is listening....");
})

