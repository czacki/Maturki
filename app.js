require('dotenv').config();

var express = require('express')
var app = express()
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://czacki_sudo:"+ process.env.PASSWORD +"@czackicluster.yysdi.gcp.mongodb.net/"+ process.env.DBNAME +"?retryWrites=true&w=majority";

app.use(express.static('public'))

var db;
MongoClient.connect(uri, (err, dbase) => {
    if(err) throw err
   // console.log(db.db("CzackiCluster"))
    db = dbase.db("CzackiCluster")
})


app.get('/getTime', (req, res) => {
    
    //get database sign in time and send remaining time

    db.collection("Users").findOne({"Name": "Timetable"}, (err, result) => {
        if(err) res.end(err)
        console.log(result.Time)
        res.end(JSON.stringify(result.Time))
    })
  
})

app.get('/getTimetable', (req, res) => {

    //get already reserved timetables from database

    db.collection("Users").find({}, {"time": 1}).toArray((err, result) => {
        if(err) res.end(err)
        res.end(JSON.stringify(result))
    })
    
})


app.post('/signIn', (req, res) => {

    console.log(req.body)

    var params = req.body

    var id = params.user_ids
    var time = params.time
    var subject = params.subject

    var dbo = db.collection("Users")

    //database check

    if(id && time && subject){

        dbo.updateOne({ID:id}, {$set: {"subject": subject, "time": time}}, (err, result) => {
            if(err) res.end(err)
            else if(result){
                res.end(result.ok)
            }
        })
    }
    else res.status(404).end("bad data")

})

app.post('/addUser', (req, res) => {
    if(payload.password == process.env.ADMIN_AUTH && payload.superuser == process.env.SUPERUSER){   //do better protection
        var payload = req.body

        var usersList = payload.usersToAdd
        var toAdd = []
        const userObj = {   //migrate to static file or sth
            "name": "",
            "lastName": "",
            "class": "",
        }

        usersList.forEach((e, i, a) => {
            const userToAdd = Object.create(userObj)
            userToAdd['ID'] = parseInt(Math.floor(Math.random() * (16 - 1 + 1) + 1), 16)
            userToAdd['name'] = e.name
            userToAdd['lastName'] = e.lastName
            userToAdd['class'] = e.class
            toAdd.push(userToAdd)
        })

        db.collection("Users").insertMany(toAdd, (err, result)=>{
            if(err) res.end(err)
            res.end(result.ok)
        })

    }
    else res.status(400).end("hell nah man")
})

app.post('/deleteUser', (req, res) => {
    if(payload.password == process.env.ADMIN_AUTH && payload.superuser == process.env.SUPERUSER){   //do better protection

        req.body.usersToDelete.forEach((e, i, a) => {
            db.collection("Users").deleteOne({$or: [{"name":e.name, "lastName":e.name, "class":e.class}, {"ID":e.ID}]}, (err, result) => {
                if(err) res.end(err)
            })
        }).then(()=>{
            res.end(result.ok)
        })
    }
})

app.use(function (err, req, res, next) {
    res.status(400).send(err.message)
  })

app.listen(3000)


// '/getTime' - GET czas do rozpoczęcia zapisów
// '/getTimetable' - GET zwraca dostępne terminy zapisów
// '/signIn' - POST zapis na matury