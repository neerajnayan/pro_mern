import React from 'react';
import 'whatwg-fetch';
import { Link } from 'react-router-dom';

import IssueAdd from './IssueAdd.jsx';
import IssueFilter from './IssueFilter.jsx';

// Compare the declaration of this component vs
// IssueTable. Both components are defined as 
// functions but with little difference.
const IssueRow = (props) => (
    <tr key={props.key}>
        <td><Link to={`/issues/${props.issue._id}`}>{props.issue._id.substr(-4)}</Link></td>
        <td>{props.issue.status}</td>
        <td>{props.issue.owner}</td>
        <td>{props.issue.created.toDateString()}</td>
        <td>{props.issue.effort}</td>
        <td>{props.issue.completionDate ? props.issue.completionDate.toDateString() : ''}</td>
        <td>{props.issue.title}</td>
    </tr>
);

function IssueTable (props) {
    const issueRows = props.issues.map(issue => 
        <IssueRow key={issue._id} issue={issue} />);
    return (
      <table className='bordered-table'>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Created</th>
                    <th>Effort</th>
                    <th>Completion Date</th>
                    <th>Title111</th>
                </tr>
            </thead>
            <tbody>
                {issueRows}
            </tbody>
      </table>
    );
}

export default class IssueList extends React.Component {
    constructor() {
        super()
        this.state = { issues: [] };
        this.createIssue = this.createIssue.bind(this);
    }
    
    componentDidMount() {
        this.loadData();
    }
    
    loadData() {
        fetch('/api/issues').then(response => {
            if (response.ok) {
                response.json().then(data => {
                    console.log('Total count of records: ', data._metadata.total_count);
                    data.records.forEach(issue => {
                        issue.created = new Date(issue.created);
                        if (issue.completionDate) {
                            issue.completionDate = new Date(issue.completionDate);
                        }
                    });
                    this.setState({issues: data.records});
                });
            } else {
                response.json().then(error => {
                    alert('Failed to fetch issues:' + error.message); 
                });
            }
        }).catch(err => {
            alert('Error in fetching data from server: ', err);
        });
    }
    
    createIssue(newIssue) {
        console.log('Creating issue: ', newIssue);
        fetch('/api/issues', {
            method: 'POST',
            headers: { 'Content-type': 'application/json'},
            body: JSON.stringify(newIssue)
        }).then(response => {
            console.log('Response from server: ', response);
            if (response.ok) {
                response.json().then(updatedIssue => {
                    updatedIssue.created = new Date(updatedIssue.created);
                    if (updatedIssue.completionDate) {
                        updatedIssue.completionDate = new Date(updatedIssue.completionDate);
                    }
                    const newIssues = this.state.issues.concat(updatedIssue);
                    this.setState({ issues: newIssues });
                });
            } else {
                response.json().then(error => {
                    alert('Failed to add issue: ' + error.message);
                });
            }
        }).catch(err => {
            alert('error in sending data to server: ' + err.message);
        });
    }
  
    render() {
        return (
            <div>
            <h1>Issue Tracker</h1>
            <IssueFilter />
            <hr />
            <IssueTable issues={this.state.issues} />
            <hr />
            <IssueAdd createIssue={this.createIssue} />
        </div>
        );
    }
}