'use strict'
// -------------------------
// Application Dependencies
// -------------------------
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');

// -------------------------
// Environment variables
// -------------------------
require('dotenv').config();
const HP_API_URL = process.env.HP_API_URL;

// -------------------------
// Application Setup
// -------------------------
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));

// Application Middleware override
app.use(methodOverride('_method'));

// Specify a directory for static resources
app.use(express.static('./public'));
app.use(express.static('./img'));

// Database Setup

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

// Set the view engine for server-side templating

app.set('view engine', 'ejs');


// ----------------------
// ------- Routes -------

app.get ("/home",renderHomePage);
app.get ("/house_name/gryffindor",retriveGryffindorChracters);
app.get ("/house_name/hufflepuff",retriveHufflepuffChracters);
app.get ("/house_name/ravenclaw",retriveRavenclawChracters);
app.get ("/house_name/slytherin",retriveSlytherinChracters);

app.post ("/character",addToDataBase);
app.get ("/character",viewFavCharacters);

app.get('/character/:id',viewcharDetails);

app.put('/character/:id',updatecharDetails);
app.delete('/character/:id',deletecharDetails);
// ----------------------


// --------------------------------
// ---- Pages Routes functions ----

function renderHomePage(req,res)
{
    res.render('home');
}

function Character(obj) {
    this.image = obj.image;
    this.name = obj.name;
    this.patronus = obj.patronus;
    this.alive = obj.alive;  
    //this.student=obj.hogwartsStudent;
  }
  

function retriveGryffindorChracters(req,res)
{
    let url='http://hp-api.herokuapp.com/api/characters/house/gryffindor';
    let Arr=[];

    superagent.get(url).then(data=>{
        data.body.forEach(result=>{
            Arr.push(new Character(result));
        })
        res.render('char-page',{data:Arr});
    
    }).catch(()=>{
        console.log('error in gryffindor ');
    })
}
function retriveHufflepuffChracters(req,res)
{
    let url='http://hp-api.herokuapp.com/api/characters/house/hufflepuff';
    let Arr=[];

    superagent.get(url).then(data=>{
        data.body.forEach(result=>{
            Arr.push(new Character(result));
        })
        res.render('char-page',{data:Arr});
    }).catch(()=>{
        console.log('error in hufflepuff ');
    })
}
function retriveRavenclawChracters(req,res)
{
    let url='http://hp-api.herokuapp.com/api/characters/house/ravenclaw';
    let Arr=[];

    superagent.get(url).then(data=>{
        data.body.forEach(result=>{
            Arr.push(new Character(result));
        })
        res.render('char-page',{data:Arr});
    }).catch(()=>{
        console.log('error in ravenclaw ');
    })
}
function retriveSlytherinChracters (req,res)
{
    let url='http://hp-api.herokuapp.com/api/characters/house/slytherin';
    let Arr=[];

    superagent.get(url).then(data=>{
        data.body.forEach(result=>{
            Arr.push(new Character(result));
        })
        res.render('char-page',{data:Arr});
    }).catch(()=>{
        console.log('error in slytherin ');
    })
}


// --------------------------------


// -----------------------------------
// --- CRUD Pages Routes functions ---

function addToDataBase(req,res){
    let query="INSERT INTO character (image,name,patronus,alive) VALUES ($1,$2,$3,$4);";
    let values=[req.body.image,req.body.name,req.body.patronus,req.body.alive];
    client.query(query,values).then(data=>{

        res.redirect('/character');

    }).catch(err =>{
        console.log('error inside add to data base;'+err);
    })


}

function viewFavCharacters(req,res)
{
    let query="SELECT * FROM character;";
    client.query(query).then(data=>{

        res.render('char-fav',{data:data.rows});

    }).catch(()=>{
        console.log('error inside viewFavCharacters;')
    })

}


function viewcharDetails(req,res)
{
    let query="SELECT * FROM character WHERE id=$1;";
    let value=[req.params.id];
    client.query(query,value).then(data=>{

        res.render('char-fav-details',{data:data.rows[0]});

    }).catch(err=>{
        console.log('error inside viewcharDetails;'+err)
    })
 
}

function updatecharDetails(req,res){
    let query="UPDATE character SET image=$1,name=$2,patronus=$3,alive=$4 WHERE id=$5;";
    let value=[req.body.image,req.body.name,req.body.patronus,req.body.alive,req.params.id];
    client.query(query,value).then(data=>{

        res.redirect('/character');

    }).catch(err=>{
        console.log('error inside viewcharDetails;'+err)
    })

}

function deletecharDetails(req,res){
    let query="DELETE FROM character WHERE id=$1;";
    let value=[req.params.id];
    client.query(query,value).then(data=>{

        res.redirect('/character');

    }).catch(err=>{
        console.log('error inside viewcharDetails;'+err)
    })

}

// -----------------------------------



// Express Runtime
client.connect().then(() => {
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}).catch(error => console.log(`Could not connect to database\n${error}`));
