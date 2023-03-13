import * as Process from "process";

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const multer  = require('multer')
import router from './router'
const errorMiddleware = require('./middlewares/error-middleware')
const PORT = process.env.PORT ?? 5000;
const app = express()

app
   .use(express.json())
   .use(cookieParser())
   .use(cors ({credentials: true, origin: 'http://localhost:5173'}))
   .use(multer({dest:"uploads/"}).single("fileData"))
   .use('/api', router)
   .use(errorMiddleware)

const db = require('./models');
db.sequelize.sync();
const start = async () =>{
    try{
        app.listen(PORT, () => console.log(`server started on port = ${PORT}`))
    }catch (e) {
        console.log(e)
    }
}
start();

