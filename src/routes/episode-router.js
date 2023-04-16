const express =  require('express');
const {getPostgreSQLClient} = require('../postgresql.js');
const router = express.Router();

router.post('/add',async (req,res)=>{
    try {

        const token = req.body.token ; 

        if(token && (token !== process.env.ACCESS_TOKEN_KEY)){
            res.status(400).json({
                message : 'Invalid Token'
            });
            return ;
        }

        if(!req.body?.episode_name || !req.body?.episode_url){
            res.status(400).json({
                message : 'EpiSode Name or Episode Url is missing'
            });
            return ;
        }

        const episode = {
            name : req.body.episode_name,
            url  : req.body.episode_url
        }

        const postgreClient = getPostgreSQLClient();

        const result = await postgreClient.query(`
            INSERT INTO episodes (episode_name, episode_url)
            VALUES ('${episode.name}','${episode.url}');
        `);

        res.status(200).json({
            message : "Data Inserted Successfully"
        });
      } catch (err) {

        console.error('Error creating table:', err.message);

        res.status(500).json({
            message : err.message
        });
      }
    
});

router.delete('/remove',async (req,res)=>{
    try {
        const {episode_id} = req.body;
        
        if(!episode_id){
            res.status(400).json({
                message : "Episode Id is required to remove data"
            });
            return ;
        }

        const postgreClient = getPostgreSQLClient();
        
        const result = await postgreClient.query(`
            delete from episodes where episode_id=${episode_id} 
        `);

        res.status(200).json({
            message : "Data Removed Successfully"
        });
        
      } catch (err) {
        res.status(500).json({
            message : err.message
        });
      }
});

router.get('/episodes',async (req,res)=>{
    try {
        const {page} = req.query ; 

        if(!page || isNaN(page)){
            res.status(400).json({
                message : 'Page No is InValid'
            });
            return ;
        }

        const start = 10 * Number(page - 1) + 1; 
        const end   = 10 * Number(page);

        const postgreClient = getPostgreSQLClient();
        
        const result = await postgreClient.query(`
            select * from episodes where episode_id >= ${start} and 
            episode_id <= ${end}
        `).then((data)=>{
            return data.rows;
        });

        res.status(200).json(result);
        
      } catch (err) {
        res.status(500).json({
            message : err.message
        });
      }
});

router.get('/total',async (req,res)=>{
    try {
        const postgreClient = getPostgreSQLClient();
        
        const result = await postgreClient.query(`
            select count(episode_id) from episodes 
        `).then((data)=>{
            return data.rows;
        });

        const total = Number(result[0].count) ; 

        res.status(200).json({
            total
        });
        
      } catch (err) {
        res.status(500).json({
            message : err.message
        });
      }
});

module.exports = {
    router
}