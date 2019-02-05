const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');

let tasks = require('./tasks');
const { getWeekStartAndEnd } = require('./utils');

const app = express();
app.use(bodyParser.json());

app.get('/api/tasks', (req, res) => {
  let resultTasks = tasks;

  if (req.query.pending) {
    resultTasks = tasks.filter(t => !t.completed);
  } else if (req.query.from && req.query.to) {
    console.log(req.query.from, req.query.to);
    const { from, to } = req.query;
    resultTasks = tasks.filter(t => {
      const date = moment(t.due);
      return date.isBetween(from, to, null, []);
    });
  }
  setTimeout(() => {
    res.json({ tasks: resultTasks });
    //res.status(400);
    //res.send('some error');
  }, 2000);
});

app.post('/api/tasks', (req, res) => {
  const task = req.body;
  const id = parseInt(_.uniqueId()) + 100;
  const taskWithId = { ...task, id: id, userid: 'dev-user-1' };
  if (!task.title || task.title.indexOf('error') !== -1) {
    res.status(400);
    res.send('some error');
    return;
  }

  tasks.push(taskWithId);
  setTimeout(() => {
    res.json(201, { task: taskWithId });
  }, 2000);
});

app.put('/api/tasks/:id', (req, res) => {
  const task = req.body;
  if (!task.title || task.title.indexOf('error') !== -1) {
    res.status(400);
    res.send('some error');
    return;
  }

  const index = tasks.findIndex(t => t.id === task.id);
  tasks[index] = task;
  setTimeout(() => {
    res.json({ task });
  }, 2000);
});

app.delete('/api/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  setTimeout(() => {
    //res.status(400);
    //res.send('some error');
    res.json({ message: 'deleted' });
  }, 5000);
});

app.get('/api/usertags', (req, res) => {
  setTimeout(() => {
    res.json({
      tags: [
        'architecture',
        'coding',
        'meeting',
        'coordination',
        'analysis',
        'gif',
        'ui',
        'documentation'
      ]
    });
    //res.status(400);
    //res.send('some error');
  }, 2000);
});

app.get('/api/taskmetrics/daily', (req, res) => {
  const { from, to } = req.query;
  const fromD = moment(from);
  const toD = moment(to);

  const current = moment(fromD);
  let metrics = [];
  while (current.isSameOrBefore(toD, 'day')) {
    metrics.push({
      day: current.utc().toISOString(),
      effort: Math.floor(Math.random() * 10)
    });
    current.add(1, 'day');
  }
  setTimeout(() => {
    res.json({
      metrics: metrics
    });
  }, 2000);
});

app.listen(4000, () => {
  console.info('mock-api server is listening in port 4000');
});
