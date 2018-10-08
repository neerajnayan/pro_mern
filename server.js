const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
// express.static generates a middleware function which responds to
// a request by trying to match the request URL with a file under a
// directory specified by the parameter to the generator function.
// If a file exists, it returns the contents of the file as the response; 
// if not, it chains to the next middleware function. 
// The middleware is mounted on the application using the application’s use() method.
app.use(express.static('static'));
app.use(bodyParser.json());

const validIssueStatus = {
    New: true,
    Open: true,
    Assigned: true,
    Fixed: true,
    Verified: true,
    Closed: true
};

const issueFieldType = {
    status: 'required',
    owner: 'required',
    effort: 'optional',
    created: 'required',
    completionDate: 'optional',
    title: 'required'
};

function validateIssue(issue) {
    for (const field in issueFieldType) {
        const type = issueFieldType[field];
        if (!type) {
            delete issue[field];
        } else if (type === 'required' && !issue[field]) {
            return `${field} is required.`;
        }
    }
    
    if (!validIssueStatus[issue.status]) {
        return `${issue.status} is not a valid status.`;
    }
    return null;
}

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
    const err = validateIssue(newIssue);
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

let db;
MongoClient.connect('mongodb://localhost:27017').then(connection => {
    db = connection.db('issuetracker');
    app.listen(3000, function() {
        console.log('App started on port 3000');
    });
}).catch(error => {
    console.log('Error:', error);
});
