// const fs = require('fs')

// fs.readFile('./test.txt', (error,data) => {
//     fs.mkdir('./testFolder', ()=>{
//         fs.writeFile('./testFolder/test2.txt', data, ()=>{
//             console.log('success')
//         })
//     })
// })



// const EventEmitter = require('events');
// const Logger = require('./log');
// const logger = new Logger();

// logger.on('some_event', (args) => {
//     let {id,name} = args;
//     console.log(`${id} ${name}`);
// });

// logger.log('ashot');





const packageJson = require("./package.json");

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/models')

const PORT = 3000;


mongoose
    .connect(packageJson.connection_string, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>console.log('Connected to DB'))
    .catch((error) => console.log(error));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.post('/signup', (req,res) => {
    let newUser = new User(); 

    // Initialize newUser object with request data 
    newUser.user_name = req.body.name, 
    newUser.user_hobby = req.body.hobby,
    newUser.password=req.body.password
                    // Call setPassword function to hash password 
                    newUser.setPassword(req.body.password); 
    // Save newUser object to database 
    newUser.save((err, User) => { 
        if (err) { 
            return res.status(400).send({ 
                message : "Failed to add user."
            }); 
        } 
        else { 
            return res.status(201).send({ 
                message : "User added successfully."
            }); 
        } 
    }); 
});


app.post('/login', (req, res) => { 

    // Find user with requested email 
    User.findOne({ user_name : req.body.name }, function(err, user) { 
        if (user === null) { 
            return res.status(400).send({ 
                message : "User not found."
            }); 
        } 
        else { 
            if (user.validPassword(req.body.password)) { 
                return res.status(201).send({ 
                    message : "User Logged In", 
                }) 
            } 
            else { 
                return res.status(400).send({ 
                    message : "Wrong Password"
                }); 
            } 
        } 
    }); 
}); 


app.use((req, res) => {
    res
        .status(404)
        .send('error');
});