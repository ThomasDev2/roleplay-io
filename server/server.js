
//express module imports
const express = require('express');
const app = express();
const http = require('http');
const cors =require('cors');

//definition of port to run on
const port = 3000;

//server configutation
const server = http.createServer(app);
app.use(express.static(__dirname));
app.use(express.json());
app.use(cors())


//connection to db
const mongo=require('./middlewares/mongoDbConnection');
mongo.connectToServer(function(){});
const ObjectId=require('mongodb').ObjectId;



//Pages rooting 
app.get('/', function(req,res,next){
    res.sendFile(__dirname+'/ressources/index.html');
});
app.get('/scripts', function(req,res,next){
    res.sendFile(__dirname+'/ressources/index.js');
});

// CRUD users
//Create
app.post('/users', function(req,res,next){
    let postedUser={
        "username":req.body.username,
        "email":req.body.email,
        "password":req.body.pswd
    };
    const dbConnect = mongo.getDb();
    dbConnect
    .collection("users")
    .insertOne(postedUser, function (err,dbRes){
        if (err) {
            console.log('Failed to add 1 user')
            res.status(400).send('Error inserting user!');
        } 
        else {
            console.log(`Added a new user ${JSON.stringify(postedUser)} with id ${dbRes.insertedId}`);
            res.status(201).send(`Added a new user ${JSON.stringify(postedUser)} with id ${dbRes.insertedId}`);
        }
    });
});

// READ
app.get('/users', function(req,res,next){
    const dbConnect = mongo.getDb();
    dbConnect
    .collection("users")
    .find({})
    .toArray(function (err, result) {
      if (err) {
        console.log(`Error serving users!`)
        res.status(400).send(`Error fetching users!`);
     } else {

        res.status(200).json(result);
      }
    });
});

// UPDATE
app.put('/users/:id', function(req,res,next){
    const id=ObjectId(req.params.id);
    const modif={
        newUsername:req.body.username,
        newEmail:req.body.email,
        newPswd:req.body.pswd
    }
    const dbConnect=mongo.getDb();
    dbConnect
    .collection('users')
    .updateOne(
        {_id:id},
        {
            $set:{
                username:modif.newUsername,
                email:modif.newEmail,
                password:modif.newPswd
            }
        },
        function(err,dbRes){
            if (err) {
                console.log(`Error updating user with id ${id}!`);
                res.status(400).send(`Error updating user with id ${id}!`);
              } else {         
                console.log(`user ${id} updated`);
                res.status(200).send(`user ${id} updated`);
              }
        }
    );
});

// DELETE
app.delete('/users/:id', function(req,res,next){
    id=ObjectId(req.params.id);
    const dbConnect=mongo.getDb();
    dbConnect
    .collection('users')
    .deleteOne(
        {_id:id},
        function(err, dbRes){
            if(err){
                console.log(`Error deleting user with id ${id}!`);
                res.status(400).send(`Error deleting user with id ${id}!`);
            } else{
                console.log(`Successfully deleted user ${id}`)
                res.status(200).send(`Successfully deleted user ${id}`);
            }
        }
    )
});

// CRUD Characters
// CREATE
app.post('/characters', function(req,res,next){
    var postedCharcter={
        "name":req.body.name,
        "class":req.body.class,
        "race":req.body.race
    }
    const dbConnect=mongo.getDb();
    dbConnect
    .collection('characters')
    .insertOne(postedCharcter,function(err,dbRes){
        if(err){
            console.log('Error inserting character!')
            res.status(400).send('Error inserting character!');
        }
        else{
            console.log(`Added a new character ${JSON.stringify(postedCharcter)} with id ${dbRes.insertedId}`);
            res.status(201).send(`Added a new character ${JSON.stringify(postedCharcter)} with id ${dbRes.insertedId}`);
        }
    })
});

// READ
app.get('/characters', function(req,res,next){
    const dbConnect=mongo.getDb();
    dbConnect
    .collection('characters')
    .find({})
    .toArray(function(err,result){
        if(err){
            console.log(`Error serving characters !`)
            res.status(400).send(`Error fetching characters !`)
        }
        else {
            res.status(200).json(result)
        }
    })
});
/**
 * untested from here no access to atlas cloud in train :/ 
 */
// UPDATE
app.put('/characters/:id', function(req,res,next){
    var id =ObjectId(req.params.id)
    var modif={
        "name":req.body.name,
        "class":req.body.class,
        "race":req.body.race
    }
    const dbConnect=mongo.getDb();
    dbConnect
    .collection('characters')
    .updateOne(
        {_id:id},
        {
            $set:{
                name:modif.name,
                class:modif.name,
                race:modif.race
            }
        },
        function(err,dbRes){
            if(err){
                console.log(`Error updating character with id ${id}!`);
                res.status(400).send(`Error updating character  with id ${id}!`);
            }
            else{
                console.log(`character ${id} updated`);
                res.status(200).send(`character ${id} updated`);
            }
        }
    )
});

// DELETE
app.delete('/characters/:id', function(req,res,next){
    var id = ObjectId(req.params.id);
    const dbConnect=mongo.getDb();
    dbConnect
    .collection('characters')
    .deleteOne({_id:id},
        function(err,dbRes){
            if(err){
                console.log(`Error deleting character with id ${id}!`);
                res.status(400).send(`Error deleting character  with id ${id}!`);
            }
            else{
                console.log(`character ${id} deleted`);
                res.status(200).send(`character ${id} deleted`);
            }
        }
    )
});

//CRUD Campaigns
// CREATE
app.post('/campaigns', function(req,res,next){
    var postedCampaign={
        "owner":req.body.owner,
        "title":req.body.title,
        "private":req.body.private,
        "players":req.body.players
        //"created":Date.now() to be implemented cant access doc right now :/
    }
    const dbConnect=mongo.getDb();
    dbConnect
    .collection('campaigns')
    .insertOne(postedCampaign,function(err,dbRes){
        if(err){
            console.log('Error inserting campaign!')
            res.status(400).send('Error inserting campaign!');
        }
        else{
            console.log(`Added a new campaign ${JSON.stringify(postedCampaign)} with id ${dbRes.insertedId}`);
            res.status(201).send(`Added a new campaign ${JSON.stringify(postedCampaign)} with id ${dbRes.insertedId}`);
        }
    })
});

// READ
app.get('/campaigns', function(req,res,next){const dbConnect=mongo.getDb();
    dbConnect
    .collection('campaigns')
    .find({})
    .toArray(function(err,result){
        if(err){
            console.log(`Error serving campaigns !`)
            res.status(400).send(`Error fetching campaigns !`)
        }
        else {
            res.status(200).json(result)
        }
    })
});

// UPDATE
app.put('/campaigns', function(req,res,next){
    const id=ObjectId(req.params.id);
    const modif={
        title:req.body.title,
        owner:req.body.owner,
        players:req.body.playes,
        private:req.body.private
    }
    const dbConnect=mongo.getDb();
    dbConnect
    .collection('users')
    .updateOne(
        {_id:id},
        {
            $set:{
                title:modif.title,
                owner:modif.owner,
                players:modif.players,
                private:modif.private
            }
        },
        function(err,dbRes){
            if (err) {
                console.log(`Error updating campaign with id ${id}!`);
                res.status(400).send(`Error updating campaign with id ${id}!`);
              } else {         
                console.log(`campaign ${id} updated`);
                res.status(200).send(`campaign ${id} updated`);
              }
        });
});

// DELETE
app.delete('/campaigns', function(req,res,next){
    var id = ObjectId(req.params.id);
    const dbConnect=mongo.getDb();
    dbConnect
    .collection('campaigns')
    .deleteOne({_id:id},
        function(err,res){
            if(err){
                console.log(`Error deleting campaign with id ${id}!`);
                res.status(400).send(`Error deleting campaign  with id ${id}!`);
            }
            else{
                console.log(`campaign ${id} deleted`);
                res.status(200).send(`campaign ${id} deleted`);
            }
        }
        )
});


//Running
server.listen(port, function(){
    console.log('listening on port : '+port);
})