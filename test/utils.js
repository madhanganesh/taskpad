const moment = require('moment');
const axios = require('axios');
const { Client } = require('pg');

const TASKS_ENDPOINT = `http://localhost:8080/api/tasks`;

async function cleanTasksTable() {
  const client = new Client({
    user: 'madhanganesh',
    host: 'localhost',
    database: 'taskpad',
    password: '',
    port: 5432
  });

  await client.connect();
  await client.query('delete from tasks');
  await client.end();
}

const makeTestTasks = (start = 0, end = 1) => {
  const tasks = [];

  let index = 1;
  for (let i = start; i < end; i++) {
    const date = moment().add(i, 'days');

    tasks.push({
      userid: 'testuser',
      title: `task - ${index++}`,
      completed: i % 2 === 0,
      due: date.utc().toISOString(),
      tags: [],
      effort: Math.floor(Math.random() * 5) + 0.5
    });
  }

  return tasks;
};

async function retrieveTaskById(id) {
  try {
    const endpoint = `${TASKS_ENDPOINT}/${id}`;
    const result = await axios.get(endpoint);
    return result.data.task;
  } catch (e) {
    console.error(e.response.status + ',' + e.response.statusText);
    return null;
  }
}

async function createTestTasksInDB(tasks) {
  await cleanTasksTable();
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const res = await axios.post(TASKS_ENDPOINT, task, {
      headers: {
        'content-type': 'application/json'
      }
    });
  }
}

function getDateRanges(days = 0) {
  const from = moment()
    .add(days, 'day')
    .startOf('day')
    .utc()
    .toISOString();
  const to = moment()
    .add(days, 'days')
    .endOf('day')
    .utc()
    .toISOString();
  return { from, to };
}

function getEndpoingForDateQuery(days) {
  const { from, to } = getDateRanges(days);
  const endpoint = `${TASKS_ENDPOINT}?from=${from}&to=${to}`;
  return endpoint;
}

function isSameDate(firstDate, deltaWrtToday) {
  const secondDate = moment().add(deltaWrtToday, 'day');
  return moment(firstDate).isSame(secondDate, 'day');
}

function getWeekStartAndEnd(weekDelta) {
  const daysAdjustedForWeekDelta = weekDelta * 7;

  const from = moment()
    .startOf('isoWeek')
    .add(1, 'day')
    .add(daysAdjustedForWeekDelta, 'days')
    .utc()
    .startOf('day')
    .toISOString();
  const to = moment()
    .endOf('isoWeek')
    .add(-2, 'day')
    .add(daysAdjustedForWeekDelta, 'days')
    .utc()
    .endOf('day')
    .toISOString();

  return { from, to };
}

module.exports = {
  cleanTasksTable,
  makeTestTasks,
  retrieveTaskById,
  createTestTasksInDB,
  getEndpoingForDateQuery,
  getWeekStartAndEnd,
  isSameDate,
  TASKS_ENDPOINT
};
