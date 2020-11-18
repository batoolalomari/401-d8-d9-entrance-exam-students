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

app.get('/home',showListOfHouses);
app.get('/House/character',showAllCharcter);
app.post('/character',addToFav);
app.get('/character',viewFav);
app.get('/character/:id',viewFavCharachter);
app.put('/character/:id',updateFavCharachterDetails);
app.delete('/character/:id',deleteFavCharachterDetails);
// ----------------------


// --------------------------------
// ---- Pages Routes functions ----



function showListOfHouses(req,res)
{
    res.render('pages/home');
}

function Character(obj) {
    this.name=obj.name;
    this.gender=obj.gender;
    this.image=obj.image;
    this.house=obj.house;
    
}
function Student(obj) {
    this.name=obj.name;
    this.gender=obj.gender;
    this.image=obj.image;
    this.house=obj.house;
    
}

function Stuff(obj) {
    this.name=obj.name;
    this.gender=obj.gender;
    this.image=obj.image;
    this.house=obj.house;
    
}

function House(obj) {
    this.name=obj.name;
    this.gender=obj.gender;
    this.image=obj.image;
    this.house=obj.house;
    
}

function  showAllCharcter(req,res) {

    let query=req.body.search;
    let url=`http://hp-api.herokuapp.com/api/characters/house/${query}`;
    let dataArr=[];
    superagent.get(url).then(data=>{
        data.body.forEach(result=>{
            dataArr.push(new House (result));
        })

        res.render('pages/characters',{data:dataArr});

    })
    
}

// --------------------------------


// -----------------------------------
// --- CRUD Pages Routes functions ---
function addToFav(req,res) {
    let query='INSERT INTO character (name,gender,image,house) VALUES ($1,$2,$3,$4) WHERE id=$1;';
    let values=[req.body.name,req.body.gender,req.bod.image,req.bod.house,req.params.id];
    client.query(query,values).then(data=>{
        res.redirect('character');

    })
    
}

function viewFav(req,res) {
    let query='SELECT * FROM character;';
    client.query(query).then(data=>{
        res.render('pages/my-characters',{data:data.rows});

    })
    
}

function viewFavCharachter(req,res) {
    let query='SELECT * FROM character WHERE id=$ ;';
    let value=[req.params.id];
    client.query(query,value).then(data=>{
        res.render(`pages/my-Character/${req.params.id}`,{data:data.rows[0]});

    })
    
}



function updateFavCharachterDetails(req,res) {


let query='UPDATE character SET name=$1 , gender=$2 , image=$3 , house=$4  WHERE id=$5;';
    let values=[req.body.name,req.body.gender,req.bod.image,req.bod.house,req.params.id];
    client.query(query,values).then(data=>{
        res.redirect('character');

    })
    
}

function deleteFavCharachterDetails(req,res) {

let query='DELETE character WHERE id=$1;';
    let values=[req.params.id];
    client.query(query,values).then(data=>{
        res.redirect('character');

    })
    
}
// -----------------------------------



// Express Runtime
client.connect().then(() => {
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}).catch(error => console.log(`Could not connect to database\n${error}`));
