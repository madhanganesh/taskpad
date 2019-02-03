const moment = require('moment');
const axios = require('axios');
const { Client } = require('pg');

const TASKS_ENDPOINT = `http://localhost:8080/api/tasks`;

const authToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJESkZSRGt6UlRrd09VSTJPVEV5UlRjMk5qTTVNa0ZEUmpFelJEVkVOemhDUkRBMlFUUXdOdyJ9.eyJpc3MiOiJodHRwczovL21pbmlzb2Z0LWRldi5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWM1NGY1ZjM2YTViM2E3NDUzZGFkYzAzIiwiYXVkIjpbInRhc3BhZC1kZXYtYXBpLWF1ZCIsImh0dHBzOi8vbWluaXNvZnQtZGV2LmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1NDkxMDczNDcsImV4cCI6MTU0OTExNDU0NywiYXpwIjoicWROZkN4aW9VZTVaSzZUejFod2tOUzB6Vzg4bmppdGIiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.p-ToDQ5GGSmxcEzF2Fd5Qcs6UnXa0stoAGyvAVzB4YVOFC2dS-UQODE36s9YOoSejJceaRinUHB3V26GgqMhOGaQJriKfixCBk8VG5pWEio2vGiMmTpDOj3i_Yfk1PK_ZQGe0YfXrEKbdWRtwzGQcapLZj2cirQ35vM1Wcb0gzdBD_2MMPY-Ujpy-3g5YwFKIOIHXptkx9x04GVxZxQYZHtCJusmMU4T37pu5Cd6b8vfqhkhuXyD7K8KSnMxNo_R4EVq0TGVK2Uf7A90WdT7fCHkkSDcyE0qZRHBIr11fYMMFvv7QRSVonvoQ-OQtd0V-mg_4qWcU-TpqL2xRY5ZYg';

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
      title: `task - ${index++}`,
      completed: i % 2 === 0,
      due: date.utc().toISOString(),
      tags: ['tag-1'],
      effort: Math.floor(Math.random() * 5) + 0.5
    });
  }

  return tasks;
};

async function retrieveTaskById(id) {
  try {
    const endpoint = `${TASKS_ENDPOINT}/${id}`;
    const result = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return result.data.task;
  } catch (e) {
    console.error(e.response.status + ',' + e.response.statusText);
    return null;
  }
}

async function cleanAndCreateTestTasksInDB(tasks) {
  await cleanTasksTable();
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const res = await axios.post(TASKS_ENDPOINT, task, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${authToken}`
      }
    });
    tasks[i] = res.data.task;
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
  cleanAndCreateTestTasksInDB,
  getEndpoingForDateQuery,
  getWeekStartAndEnd,
  isSameDate,
  TASKS_ENDPOINT
};
