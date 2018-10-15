import express from 'express';
const path = require('path');
import bodyParser from 'body-parser';
import 'babel-polyfill';
import { MongoClient } from 'mongodb';
import SourceMapSupport from 'source-map-support';
SourceMapSupport.install();

import Issue from './issue.js';

const app = express();
// express.static generates a middleware function which responds to
// a request by trying to match the request URL with a file under a
// directory specified by the parameter to the generator function.
// If a file exists, it returns the contents of the file as the response; 
// if not, it chains to the next middleware function. 
// The middleware is mounted on the application using the application�s use() method.
app.use(express.static('static'));
app.use(bodyParser.json());

app.get('/api/issues', (req, res) => {
//    const metadata = { total_count: issues.length };
//    res.json({ _metadata: metadata, records: issues});
    
    db.collection('issues').find().toArray().then(issues => {
        const metadata = { total_count: issues.length };
        res.json({ _metadata: metadata, records: issues});
    }).catch(error => {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: $(error)`});
    });
});

app.post('/api/issues', (req, res) => {
    const newIssue = req.body;
    newIssue.created = new Date();
    if (!newIssue.status) {
        newIssue.status = 'New';
    }
    const err = Issue.validateIssue(newIssue);
    if (err) {
        res.status(422).json({message: `Invalid request: ${err}` });
        return;
    }
    db.collection('issues').insertOne(newIssue).then(result => 
        db.collection('issues').find({ _id: result.insertedId }).limit(1).next())
        .then(newIssue => {
            res.json(newIssue);
        }).catch(error => {
        console.log(error);
        res.status(500).json({message: `Internal server error: $(error)` });
    });
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) => {
    console.log('Path: ', path.join(__dirname+'/../static/index.html'));
    res.sendFile(path.join(__dirname+'/../static/'));
});
console.log('sddd');

let db;
MongoClient.connect('mongodb://localhost:27017').then(connection => {
    db = connection.db('issuetracker');
    app.listen(3000, function() {
        console.log('App started on port 3000');
    });
}).catch(error => {
    console.log('Error:', error);
});
