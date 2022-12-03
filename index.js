const express = require('express');
const bodyParser = require('body-parser');
const {connectRedis} = require('./utility/redis');
const db = require('./models/index');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

//cors error solution
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET , POST, PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});
//health check 
app.get('/health-check',(req,res)=>{
    res.status(202).json({
        "status":"202",
        "message":"Backend working Fine !"
    })
})

db.sequelize.sync().then(req => {
    let redisConnection = connectRedis();
    redisConnection.then((client) => {
        app.listen(process.env.PORT, () => {
            //api not found
            app.use((req, res) => {
                res.status(404).json({ message: 'Route Not Found !' });
            });            
            console.log(`Server is running on the port ${process.env.PORT}`);
        })
    }).catch((err) => {
        console.log('Error Occured while connecting With Redis', err);
    })
}).catch((err) => {
    console.log('Error Occured while connecting With Database', err);
})
