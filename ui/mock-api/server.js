const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

//const Moment = require('moment');
//const MomentRange = require('moment-range');
//const moment = MomentRange.extendMoment(Moment);

const moment = require('moment');

let tasks = require('./tasks');

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
  }, 2000);
});

app.post('/api/tasks', (req, res) => {
  const task = req.body;
  const id = parseInt(_.uniqueId()) + 100;
  const taskWithId = { ...task, id: id, userid: 'dev-user-1' };
  tasks.push(taskWithId);
  setTimeout(() => {
    res.json(201, { task: taskWithId });
  }, 2000);
});

app.put('/api/tasks/:id', (req, res) => {
  const task = req.body;
  const index = tasks.findIndex(t => t.id === task.id);
  tasks[index] = task;
  setTimeout(() => {
    res.json({ task });
  }, 5000);
});

app.delete('/api/tasks/:id', (req, res) => {
  console.log(`id isssssss ${req.params.id}`);
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  setTimeout(() => {
    res.json({ message: 'deleted' });
  }, 5000);
});

app.listen(4000, () => {
  console.info('mock-api server is listening in port 4000');
});
