var express = require('express');
var router = express.Router();
var journeyModel = require('../models/journeys');
var userModel = require('../models/userModel');
var orderModel = require('../models/orders');
function toFormat(string){
  if(string.length === 0){
    return string ;
  }
  else{
    var newString = "";
    newString+=(string[0].toUpperCase());
    for(let i = 1 ; i<string.length ; i++){
      newString+=string[i].toLowerCase();
    }
    return newString;
  }
 
}
/* GET home page. */

router.get('/', function(req, res, next) {
  
  if(req.session.searchUser!=null){
    if(req.session.searchUser.email === req.session.email && req.session.searchUser.password === req.session.password){
      /*Instructions si connecté*/
      res.render('home' , {navInfos:{pageName: 'home'}} ); 
    }
    else{
      res.redirect('/login');
    }
  }
  else{
    res.redirect('/login');
  }
});

/* GET login */
router.get('/login', function(req, res, next){
  req.session.email = "";
  req.session.password = "";
  res.render('login',{navInfos: {pageName: 'login'}});
});

/* POST search */
router.post('/search', async function(req, res, next){
  req.session.date = req.body.date;
  req.session.departure = toFormat(req.body.departure);
  req.session.arrival = toFormat(req.body.arrival);

  var day = req.session.date.substr(0, 2);
  var month = req.session.date.substr(3, 2);
  var year = req.session.date.substr(6, 4);
  var dateUTC = year + "-" + month + "-" + day + "T00:00:00.000+00:00";
  var dateFormat = day + "/" + month;

  var resultSearch = await journeyModel.find( { departure: req.session.departure, arrival: req.session.arrival, date: dateUTC } );
  res.render('search', {navInfos:{pageName:'results'},resultSearch, dateFormat} );
});

/* GET order */
router.get('/order', async function(req, res, next){
  if(req.session.searchUser!=null){
    if(req.session.searchUser.email === req.session.email && req.session.searchUser.password === req.session.password){
      /*Instructions si connecté*/
      req.session.journeyId = req.query.journeyId; // Récupération de l'ID du voyage
      req.session.user = await userModel.findOne({email: req.session.email});
      req.session.userId = req.session.user._id; // Récupération de l'ID du user via son email enregistré en session
      req.session.newOrder = new orderModel({
        journey: req.session.journeyId,
        user: req.session.userId,
        confirmed: false
      });
      await req.session.newOrder.save(); // Sauvegarde de order dans la collection order
      res.redirect('/orderList');
    }
    else{
      res.redirect('/login');
    }
  }
  else{
    res.redirect('/login');
  }
});

router.get('/orderList', async function(req, res, next){
  
  if(req.session.searchUser!=null){
    if(req.session.searchUser.email === req.session.email && req.session.searchUser.password === req.session.password){
      /*Instructions si connecté*/
      req.session.allOrders = await orderModel.find({user: req.session.userId}).populate('journey').exec(); //Récupérer les infos de toutes les commandes faites par l'utilisateur
      req.session.allNewOrders = [];
      for(let i = 0 ; i< req.session.allOrders.length; i++){
        if(req.session.allOrders[i].confirmed === false){
          req.session.allNewOrders.push(req.session.allOrders[i]);
        }
      }
      res.render('order', {navInfos:{pageName:'order'}, orders: req.session.allNewOrders});
    }
    else{
      res.redirect('/login');
    }
  }
  else{
    res.redirect('/login');
  }
 
});

/* Route lastTrips*/

router.get('/mytrips', async function (req, res, next){
  if(req.session.searchUser!=null){
    if(req.session.searchUser.email === req.session.email && req.session.searchUser.password === req.session.password){
      /*Instructions si connecté*/
      req.session.user = await userModel.findOne({email: req.session.email});
      if (req.query.confirmed == "true") {
        await orderModel.updateMany(
          { user: req.session.user._id },
          { confirmed: true }
        );
      }
      var orders = await orderModel.find({user: req.session.user._id, confirmed: true}).populate('journey').exec();
      res.render('mytrips', {navInfos:{pageName: 'myLastTrips'}, orders});
    }
    else{
      res.redirect('/login');
    }
  }
  else{
    res.redirect('/login');
  }
});


/*Route Sign-Up*/
router.post('/signUp', async function(req, res, next){
  req.session.name = req.body.name;
  req.session.firstName = req.body.firstName;
  req.session.email = req.body.email;
  req.session.password = req.body.password;
  req.session.searchUser = await userModel.findOne({email: req.session.email});
  
  if(req.session.searchUser != null){
    res.redirect('/login');
  }
  else{
    req.session.newUser = new userModel({
      name: req.session.name,
      firstName: req.session.firstName,
      email: req.session.email,
      password: req.session.password,
      orders: []
    });
    req.session.searchUser = await req.session.newUser.save();
    res.redirect('/');
  }  
});

/* Route Sign-In */

router.post('/signIn', async function(req, res, next){
  req.session.email = req.body.email;
  req.session.password = req.body.password;
  req.session.searchUser = await userModel.findOne({email: req.session.email, password: req.session.password});
  res.redirect('/');

});


   
module.exports = router;
