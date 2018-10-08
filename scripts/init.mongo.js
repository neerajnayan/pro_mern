// This script creates a mongo DB (issuetracker)
// and a collection inside that DB (issues).

// To run the script use, 
// $ mongo <script-file-path>

// Create a DB, if does not already exist
db = new Mongo().getDB('issuetracker');
// Remove all issues from issues collection.
db.issues.remove({});
// Insert new issues
db.issues.insert([
    {
        status: 'Open', owner: 'Ravan',
        created: new Date('2016-08-05'), effort: 5, 
        completionDate: undefined,
        title: 'Error in console while clicking Add'
    },
    {
        status: 'Assigned', owner: 'Eddie',
        created: new Date('2018-09-22'), effort: 14, 
        completionDate: new Date('2018-10-10'),
        title: 'Missing bottom border on panel'
    }
]);

// Create indexes
db.issues.createIndex({status: 1});
db.issues.createIndex({owner: 1});
db.issues.createIndex({created: 1});

