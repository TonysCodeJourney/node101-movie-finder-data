const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const axios = require('axios');
const mcache = require('memory-cache');



app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));


var cacheI = {};
var cacheT = {};
var i;
var t;

app.get('/', function(req, res){
    if(!(req.query.i in cacheI) && req.query.i !== undefined){
        axios.get('http://www.omdbapi.com/', { params: { apiKey: '8730e0e', i: req.query.i}})   
                    .then(function(response) {
                        cacheI[req.query.i] = response.data.Title;
                        i = req.query.i;
                        console.log('i am here');
                        res.send(response.data.Title);
                        })
                    .catch(function(error){
                        console.log(error);
                        }) 
        }
    else if (req.query.i in cacheI){
        console.log(cacheI);
        res.send(cacheI[req.query.i]);
        } 
    else if (req.query.t !== t && req.query.t !== undefined) {
        axios.get('http://www.omdbapi.com/', { params: { apiKey: '8730e0e', t: req.query.t}})   
            .then(function(response) {
                cacheT[req.query.t] = response.data;
                t = req.query.t;
                res.send(response.data);
                })
            .catch(function(error){
                console.log(error);
                }) 
        }
    else if(req.query.t === t && req.query.t !== undefined){
            console.log('i am here 3');
            res.send(cacheT[req.query.t]);
        }  
    else { 
        if(req.query.t === undefined && req.query.i === undefined){
            res.send('no parameters selected.  Please enter either I or T parameter');
            }
        }             
    });
      
//When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter

module.exports = app;

//  app.listen(3000, function() {
//      console.log('Server is listening on http://localhost:3000');
//      });

