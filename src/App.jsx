import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, Redirect, hashHistory } from 'react-router';
import { BrowserRouter, Link } from 'react-router-dom';

import IssueList from './IssueList.jsx';
import IssueEdit from './IssueEdit.jsx';

var contentNode = document.getElementById('contents');

const NoMatch = () =><p>Page Not Found</p>;

const Issues = () => <p><Link to="/issues">Issue List</Link> </p>;
const IssueId = () => <p> Issue Id</p>;

const RoutedApp = () => (
    <BrowserRouter>
        <Switch>
            <Redirect exact from="/" to="/issues" />
            <Route exact path="/issues" component={IssueList} />
            <Route exact path="/issues/:id" component={IssueEdit} />
            <Route path="*" component={NoMatch} />
        </Switch>
    </BrowserRouter>
);
ReactDOM.render(<RoutedApp />, contentNode);