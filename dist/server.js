'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

require('babel-polyfill');

var _mongodb = require('mongodb');

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

var _issue = require('./issue.js');

var _issue2 = _interopRequireDefault(_issue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');

_sourceMapSupport2.default.install();

var app = (0, _express2.default)();
// express.static generates a middleware function which responds to
// a request by trying to match the request URL with a file under a
// directory specified by the parameter to the generator function.
// If a file exists, it returns the contents of the file as the response; 
// if not, it chains to the next middleware function. 
// The middleware is mounted on the application using the application�s use() method.
app.use(_express2.default.static('static'));
app.use(_bodyParser2.default.json());

app.get('/api/issues', function (req, res) {
    //    const metadata = { total_count: issues.length };
    //    res.json({ _metadata: metadata, records: issues});

    db.collection('issues').find().toArray().then(function (issues) {
        var metadata = { total_count: issues.length };
        res.json({ _metadata: metadata, records: issues });
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error: $(error)' });
    });
});

app.post('/api/issues', function (req, res) {
    var newIssue = req.body;
    newIssue.created = new Date();
    if (!newIssue.status) {
        newIssue.status = 'New';
    }
    var err = _issue2.default.validateIssue(newIssue);
    if (err) {
        res.status(422).json({ message: 'Invalid request: ' + err });
        return;
    }
    db.collection('issues').insertOne(newIssue).then(function (result) {
        return db.collection('issues').find({ _id: result.insertedId }).limit(1).next();
    }).then(function (newIssue) {
        res.json(newIssue);
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error: $(error)' });
    });
});

// Handles any requests that don't match the ones above
app.get('*', function (req, res) {
    console.log('Path: ', path.join(__dirname + '/../static/index.html'));
    res.sendFile(path.join(__dirname + '/../static/'));
});
console.log('sddd');

var db = void 0;
_mongodb.MongoClient.connect('mongodb://localhost:27017').then(function (connection) {
    db = connection.db('issuetracker');
    app.listen(3000, function () {
        console.log('App started on port 3000');
    });
}).catch(function (error) {
    console.log('Error:', error);
});
//# sourceMappingURL=server.js.map