import React from 'react';
import ReactDOM from 'react-dom';

import IssueAdd from './IssueAdd.jsx';
import IssueList from './IssueList.jsx';

var contentNode = document.getElementById('contents');
ReactDOM.render(<IssueList />, contentNode);