require('dotenv').config()
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const userRouter = require('./server/routes/user.routes');
const authRouter = require('./server/auth/auth.router')
const db = require('./server/db/connection')
const cors = require('cors')
const {API_PORT} = process.env;

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use(express.static(path.resolve('./build')))

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)


app.get('/', (req,res) => {
    res.send('Everythign is ok!')
})


const server = app.listen( API_PORT, ()=> {
    console.log(`Listening on ${API_PORT}`)
})

db.connect();




