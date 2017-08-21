var mongoose = require("mongoose");
var express = require('express');
var bodyParser = require('body-parser');


var app = express();
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json(), function (err, req, res, next) {
    if (err) {
        return res.status(500).json({ error: err });
    }
    next();
})
app.use(bodyParser.urlencoded({ extended: false }));


//------ schema started----

mongoose.connect('mongodb://demo:demo@ds059115.mlab.com:59115/demo', {
    useMongoClient: true
    /* other options */
});

var patientSchema = mongoose.Schema({
    name: String,
    disease: String,
    treatment: String,
    date: String,
})


var patientModel = mongoose.model("patients", patientSchema);



//------ schema ended -----


app.get("/", function (req, res) {
    res.send("Hello world!");
});
// -----acces controlled
//------ create patients------
app.post('/CREATEPATIENT', function (request, response) {
    response.header('Access-Control-Allow-Origin', "*")
    var patientObj = {
        name: request.body.name,
        disease: request.body.disease,
        treatment: request.body.treatment,
        date: request.body.date
    }
    console.log(patientObj, 'patientObj')

    var saveData = new patientModel(patientObj)
    saveData.save(function (err, data) {
        if (!err) {
            console.log("data", data)
            response.send(data)
        }
        else {
            console.log("Err", err)
            response.send(err)
        }
    })

});
//----- end create patients-----

//------ getting data-----
app.get("/CREATEPATIENT", function (req, res) {
    patientModel.find(function (err, patients) {
        if (err) {
            res.send(err)
        }
        res.json(patients);
        console.log(patients, "patients patients patients")
    });
});

//-----getting data end-----

app.delete("/CREATEPATIENT/DELETE/:id", function (req, res) {
    patientModel.remove({
        _id: req.params.id
    }, function (err, patients) {
        if (err) {
            res.send(err)
        }
        res.json(patients)
        // res.json({ response: 'Deleted Successfully' });
    })
})
app.delete("/CREATEPATIENT/DELETE/ALL", function (req, res) {
    patientModel.remove({
    }, function (err, patients) {
        if (err) {
            res.send(err)
        }
        res.json(patients)
        // res.json({ response: 'Deleted Successfully' });
    })
})





// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ');
});
// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});
// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

app.listen(app.get("port"), function () {
    console.log("Server run on port " + app.get("port"))
});


