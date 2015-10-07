var express = require('express');
var path = require('path');
/*var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');*/
var bodyParser = require('body-parser');

var auth = require('basic-auth');

var fs = require('fs');
var routes = require('./routes/index');
var games = require('./routes/games');

var async = require('async');

var mongoose = require('mongoose');
var app = express();

var models = require(__dirname + '/models/copypastas.js');
var Copypasta = models.Copypasta;
var PendingPasta = models.PendingPasta;
var Ad = models.Ad;

var topFileUpdateInterval = 5 * 60 * 1000; // x minutes * seconds * milliseconds. 5 min right now
var hotFileUpdateInterval = 10 * 1000; //update every 10 sec

var ppp = 15; //pastas per page

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//setup mongoose/mongodb connection;
mongoose.connect('mongodb://localhost/copypastas', function(err){
    if (err){
        console.log('ayy lmao we lost boys: couldn\'t connect to the server');
        console.log('retrying');
    }else{
        console.log('Connected to the database.');
    }
});

app.use('/', routes);
app.use('/', games)

//Load in server variables

var serverVars = JSON.parse(fs.readFileSync('servervars.txt', 'utf8'));

app.get('/', function(req, res) {
        res.render('index', {
        buttonText: 'all',
        pastaType: 'all',
        category: 'hot',
        page: '1',
        alertMessage: serverVars.alertMessage,
        alertType: serverVars.alertType
    });
});

app.get('/:type/:category/:page', function(req, res){
    if (req.params.type === 'misc'){
        var buttonText = 'twitch, dongers&amp;ASCII'
    }else if(req.params.type === 'general'){
        var buttonText = 'reddit&amp;4chan'
    }else{
        var buttonText = req.params.type;
    }
    res.render('index', {
        buttonText: buttonText,
        pastaType: req.params.type,
        category: req.params.category,
        page: req.params.page,
        alertMessage: serverVars.alertMessage,
        alertType: serverVars.alertType
    });
});

app.get('/favorites', function(req, res) {
    res.render('index', {
        buttonText: 'all',
        pastaType: 'all',
        category: 'favourites',
        page: '',
        alertMessage: serverVars.alertMessage,
        alertType: serverVars.alertType
    });
});

//Pretty much loads ALL categoried requests
app.get('/static/:pastatype/:category/:id', function(req, res){
    var filePath = (path.join(__dirname + '/jsons/' + req.params.pastatype + '/'+ req.params.category + req.params.id) + ".json").toLowerCase();
    res.sendFile(filePath);
});

//When the user searches this shit happens
app.get('/search/:terms', function(req, res){
    var regex = new RegExp(req.params.terms, 'i');
    Copypasta.find({ $text : {$search: req.params.terms} },
         { score: { $meta: "textScore" } })   
    .sort( { score: { $meta: "textScore" } } )
    .limit(20)
    .exec(function(err, pastas){
        //console.log(pastas)
        res.send(pastas);
        //if not an empty array
/*        if (pastas.length !== 0){
            res.send(pastas);
        }else{
            Copypasta.findOne({'id': 0})
            .exec(function(err, pasta){
                res.send(pasta);
            });
        }*/
    });
});

//allows user to submit
app.post('/submitpasta', function(req, res){
    //creates a new document in the pending pastas collection. admin can then approve or deny these.
    var userPasta = new PendingPasta({
            pasta: req.body.pasta,
            tags: req.body.tags,
        });
    userPasta.save();
    res.end();
});

app.post('/favouritepasta', function(req, res){
    var conditions = {'id':req.body.id}, update = { $inc: { 'favourites' : 1 }};
    Copypasta.findOneAndUpdate(conditions, update, function(err){
        if(err)
            throw err; //ayy lmao im not doing any error handling
    });
    res.end();
});

app.get('/admin', function(req, res){
    var credentials = auth(req)

    if (!credentials || credentials.name !== 'michaelluo' || credentials.pass !== 'ayylmao') {
    res.writeHead(401, {
      'WWW-Authenticate': 'Basic realm="YOU SHALL NOT PASS! seriously dont enter pls"'
    })
        res.end()
    } else {
        res.render('admin');
    }
});

app.post('/approvepasta', function(req, res){
    Copypasta.findOne()
    .sort('-id')
    .exec(function(err, pasta){
        var approvedPasta = new Copypasta({
            id: (pasta.id + 1),
            pasta: req.body.pasta,
            tags: req.body.tags, 
            favourites: 0
            });
        approvedPasta.save();
        PendingPasta.findOneAndRemove({ _id: req.body._id }, function(err){
            if (err) throw err;
        });
        res.end();
    });
});

app.post('/rejectpasta', function(req, res){
    PendingPasta.findOneAndRemove({ _id: req.body._id }, function(err){
        if (err) throw err;
        res.end()
    });
});

app.get('/getpendingpasta', function(req, res){
    PendingPasta.findOne().sort({created_on:1}).exec(function(err, pasta){
        if (err) throw err;
        else{
            res.send(pasta);
        }
    });
});

app.get('/adminfindpasta/:terms', function(req, res){
    Copypasta.findOne({tags:decodeURIComponent(req.params.terms)}, function(err, pasta){
        if (err) throw err;
        else{
            res.send(pasta);
        }
    });
});

app.get('/admingetcount', function(req, res){
    PendingPasta.count({}, function(err, count){
        res.send(count.toString());
    });
});
app.post('/adminupdatepasta', function(req, res){
    var conditions = { 'id': req.body.id }
    var update = { 
            $set: { 
                'pasta': req.body.pasta,
                'tags': req.body.tags
            }
        };
    Copypasta.findOneAndUpdate(conditions, update, function(err){
        if(err)
            throw err; //ayy lmao im not doing any error handling
    });
    res.end();
});

app.post('/adminupdatevar/:variable', function(req, res){
    if (req.params.variable === "alertMessage"){
        serverVars.alertMessage = req.body.change;
    }else if (req.params.variable === "alertType"){
        serverVars.alertType = req.body.change;
    }
    fs.writeFile(__dirname + "/servervars.txt", JSON.stringify(serverVars), function(err){
        console.log(err);
        res.end();
    });
});


app.get('/copypastas/:pastaid', function(req, res){
    Copypasta.findOne({id: req.params.pastaid})
    .exec(function(err, specificPasta){
        if (err) console.log(err);
        if (!specificPasta){
            specificPasta = {
                    pasta: 'There is no pasta by that ID. It has probably been deleted or was never there to begin with.',
                    tags: '#nopasta',
                    pastaNum: req.params.pastaid
                };
        }
        res.render('pages/spec', {
            pasta: specificPasta.pasta,
            tags: specificPasta.tags,
            pastaNum: specificPasta.id 
        });
    });
});

app.get('/copypastascount', function(req, res){
    Copypasta.count({}, function(err, count){
        res.send(200, count);
    })
});

app.get('/getDeals', function(req, res){
    Ad.find({}, function(err, deals){
        res.send(deals);
    });
});
app.post('/createad', function(req, res){
    var newAd = new Ad({
        description: req.body.description,
        link: req.body.link
    });
    newAd.save();
    res.end();
});

app.post('/removeAd', function(req, res){
    Ad.remove({description: req.body.description}, function(err){
        console.log("Ad removed." + req.body.description);
    })
});

//SEO/Google shit
app.get('/robots.txt', function(req, res){
    res.sendFile('robots.txt');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('pages/error', {
        message: err.message,
        error: {}
    });
});
//Database and jsonfile logic
//slashes and "" are for the exact phrase search
var genFilter = "/|#general|#reddit|#4chan|#tumblr/";
var hsFilter = "#hearthstone";
var dotaFilter = "#dota2";
var lolFilter = "#lol";
var miscFilter = "/|#donger|#ASCII|#twitch/";

var newCondition = {'id':-1},
    hotCondition = {'score':-1},
    topCondition = {'favourites':-1};

//how fast things fall down from the popular list
//lowish gravity cuz aint that popular mang
var gravity = 1.25;

function createArg(filter){
    if (filter !== ""){
        return { tags : {$regex: filter, $options: 'i'} };
    }else{
        return {};
    }
}

function queryAndSave(argument, condition, typeName, category, page, timeFrame){
    if (timeFrame != 0){
        var checkTime = new Date(Date.now() - (timeFrame * 86400 * 1000)) // x days * sec/day * ms
    }else{
        var checkTime = new Date(0);
    }
    //get 15 because each page has 15

    var offset = (page - 1) * ppp;
    Copypasta.find(createArg(argument)) 
    .where('created_on').gt(checkTime)
    .sort(condition)
    .skip(offset)
    .limit(ppp)
    .exec(function(err, pastas){
        if (err) console.log(err);
        fs.writeFile(__dirname + '/jsons/' + typeName + '/' + category + page + '.json', JSON.stringify(pastas), function(err){
            if (err){
                console.log(err);
            }
            else{
            }
        });
    });
}

function updateAllPastas(condition, category, timeFrame){
    queryAndSave("", condition, 'all', category, 1, timeFrame);
    queryAndSave("", condition, 'all', category, 2, timeFrame);
    queryAndSave("", condition, 'all', category, 3, timeFrame);
    queryAndSave("", condition, 'all', category, 4, timeFrame);
    queryAndSave("", condition, 'all', category, 5, timeFrame);
    queryAndSave("", condition, 'all', category, 6, timeFrame);
    queryAndSave("", condition, 'all', category, 7, timeFrame);
}

function updateTopPastas(argument, condition, typeName){
    queryAndSave(argument, condition, typeName, 'thisweek', 1, 7);
    queryAndSave(argument, condition, typeName, 'thismonth', 1, 30);
    queryAndSave(argument, condition, typeName, 'alltime', 1, 0);
}

function updateTypePastas(argument, condition, typeName, category, timeFrame){
    queryAndSave(argument, condition, typeName, category, 1, timeFrame);
    queryAndSave(argument, condition, typeName, category, 2, timeFrame);
    queryAndSave(argument, condition, typeName, category, 3, timeFrame);
    queryAndSave(argument, condition, typeName, category, 4, timeFrame);
    queryAndSave(argument, condition, typeName, category, 5, timeFrame);
    queryAndSave(argument, condition, typeName, category, 6, timeFrame);
    queryAndSave(argument, condition, typeName, category, 7, timeFrame);
}

var updatePastaScore = function updateHotPastas(){
    //get date in hours
    var currentTime = Date.now();

    Copypasta.find({}, function(err, pastas){
        async.each(pastas, function(pasta, callback){
            //get time in hours then add 2, so new posts with 1 upvote dont rise up
            var time = Math.max(((currentTime - pasta.created_on.valueOf()) / 3.6e6) + 2, 3000);
            var pastaScore = Math.pow(pasta.favourites - 1, 5/6) / Math.pow(time + 2, gravity);
            if (!(pastaScore > 0)){
                pastaScore = 0;
            }
            Copypasta.find({id: pasta.id})
            .limit(1)
            .update({ score: pastaScore }, function(err){
                if (err) console.log(err);
            });;
        }, function(err){
            if (err) console.log(err);
        });
    });
}
var topUpdate = function updateTopJSONFiles(){

    //Updates pastas for top
    updateAllPastas(topCondition, 'thisweek', 7);
    updateAllPastas(topCondition, 'thismonth', 30);
    updateAllPastas(topCondition, 'alltime', 0);
    
    updateTopPastas(genFilter, topCondition, 'general');
    updateTopPastas(hsFilter, topCondition, 'hearthstone');
    updateTopPastas(dotaFilter, topCondition, 'dota');
    updateTopPastas(lolFilter, topCondition, 'lol');
    updateTopPastas(miscFilter, topCondition, 'misc');
    //
    console.log("Top pastas have been updated.");
}
var hotUpdate = function updateHotJSONFiles(){
    //new
    updateAllPastas(newCondition, 'new', 0);

    updateTypePastas(genFilter, newCondition, 'general', 'new', 0);
    updateTypePastas(hsFilter, newCondition, 'hearthstone', 'new', 0);
    updateTypePastas(dotaFilter, newCondition, 'dota', 'new', 0);
    updateTypePastas(lolFilter, newCondition, 'lol', 'new', 0);
    updateTypePastas(miscFilter, newCondition, 'misc', 'new', 0);
    //hot
    updateAllPastas(hotCondition, 'hot', 0);

    updateTypePastas(genFilter, hotCondition, 'general', 'hot', 0);
    updateTypePastas(hsFilter, hotCondition, 'hearthstone', 'hot', 0);
    updateTypePastas(dotaFilter, hotCondition, 'dota', 'hot', 0);
    updateTypePastas(lolFilter, hotCondition, 'lol', 'hot', 0);
    updateTypePastas(miscFilter, hotCondition, 'misc', 'hot', 0);
}

//update them every restart
topUpdate();
hotUpdate();
updatePastaScore();

setInterval(updatePastaScore, topFileUpdateInterval);
setInterval(topUpdate, topFileUpdateInterval);
setInterval(hotUpdate, hotFileUpdateInterval);

module.exports = app;
