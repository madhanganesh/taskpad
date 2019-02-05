const moment = require('moment');

const makeTestTasks = (start = 0, end = 1) => {
  const tasks = [];

  let index = 1;
  for (let i = start; i < end; i++) {
    const date = moment().add(i, 'days');

    tasks.push({
      id: i,
      userid: 'dev-test-user',
      title: `task - ${index++}`,
      completed: i % 2 === 0,
      due: date.utc().toISOString(),
      tags: ['tag-1'],
      effort: Math.floor(Math.random() * 5) + 0.5,
      notes: ''
    });
  }

  return tasks;
};

//let tasks = makeTestTasks(-7, 7);
let tasks = makeTestTasks(0, 1);

module.exports = tasks;
