const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// express.static generates a middleware function which responds to
// a request by trying to match the request URL with a file under a
// directory specified by the parameter to the generator function.
// If a file exists, it returns the contents of the file as the response; 
// if not, it chains to the next middleware function. 
// The middleware is mounted on the application using the application’s use() method.
app.use(express.static('static'));
app.use(bodyParser.json());

const issues = [
    {
        id: 1, status: 'Open', owner: 'Ravan',
        created: new Date('2016-08-05'), effort: 5, completionDate: undefined,
        title: 'Error in console while clicking Add'
    },
    {
        id: 2, status: 'Assigned', owner: 'Eddie',
        created: new Date('2018-09-22'), effort: 14, completionDate: new Date('2018-10-10'),
        title: 'Missing bottom border on panel'
    }
];

const validIssueStatus = {
    New: true,
    Open: true,
    Assigned: true,
    Fixed: true,
    Verified: true,
    Closed: true
};

const issueFieldType = {
    id: 'required',
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
    const metadata = { total_count: issues.length };
    res.json({ _metadata: metadata, records: issues});
});

app.post('/api/issues', (req, res) => {
    const newIssue = req.body;
    newIssue.id = issues.length + 1;
    newIssue.created = new Date();
    if (!newIssue.status) {
        newIssue.status = 'New';
    }
    
    const err = validateIssue(newIssue);
    if (err) {
        res.status(422).json({message: `Invalid request: ${err}` });
        return;
    }
    issues.push(newIssue);
    res.json(newIssue);
})

app.listen(3000, function() {
  console.log('App started on port 3000');
});
