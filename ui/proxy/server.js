const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');

let tasks = [
  {
    id: 1,
    userid: 'devuser',
    title: 'dev task - 1',
    due: moment()
      .utc()
      .toISOString(),
    completed: false,
    effort: 1.5,
    tags: [],
    notes: ''
  }
];

const app = express();

app.get('/api/tasks', (req, res) => {
  res.json({ tasks });
});

app.listen(4000, () => {
  console.info('proxy server is listening in port 4000');
});
