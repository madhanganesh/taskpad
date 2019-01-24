const moment = require('moment');
const axios = require('axios');
const { Client } = require('pg');

const TASKS_ENDPOINT = `http://localhost:8080/api/tasks`;
const authToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJESkZSRGt6UlRrd09VSTJPVEV5UlRjMk5qTTVNa0ZEUmpFelJEVkVOemhDUkRBMlFUUXdOdyJ9.eyJpc3MiOiJodHRwczovL21pbmlzb2Z0LWRldi5hdXRoMC5jb20vIiwic3ViIjoidjNRVnR0eW9uOXBBRVFOUk1sY1NDaEtOOXhRT0xtTXhAY2xpZW50cyIsImF1ZCI6InRhc3BhZC1kZXYtYXBpLWF1ZCIsImlhdCI6MTU0ODI5ODQwOCwiZXhwIjoxNTQ4Mzg0ODA4LCJhenAiOiJ2M1FWdHR5b245cEFFUU5STWxjU0NoS045eFFPTG1NeCIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.Gu7Zr-Z0sSavkpcU6h94MiVX2b_c_TjzcGrPVYmjCgVtJ5picsPPN7KKH2aECdre-Kcz3_CAXXZRhHqky3JurdvDwaebmRDdItEhWVg9p0gcpsvs_5CwhvxEqxQYtiLwR2SreX4j8djrpK_a-9rOxOgF_ldjgziDnS1yIwGNG9HJabvFBN7BMbhYR4vwgaUmvQi4b-PvE94mxZW8JI_RHmdvt7lctDrJ9rb0qaSXJvqo2T0Y9iNiQhw301Xt-IiW73tW0Gm76R4R3aXJOYlJa3HzUVa580ED6A-j98t3BPuFoapeT2zEW65NihpLs3M1ajUlWSm-NE9xTM9Uzn5axw';

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
