const moment = require('moment');
const expect = require('expect');
const request = require('superagent');

const {
  TASKS_ENDPOINT,
  makeTestTasks,
  cleanAndCreateTestTasksInDB,
  getEndpoingForDateQuery,
  getWeekStartAndEnd,
  isSameDate
} = require('./utils');

const authToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJESkZSRGt6UlRrd09VSTJPVEV5UlRjMk5qTTVNa0ZEUmpFelJEVkVOemhDUkRBMlFUUXdOdyJ9.eyJpc3MiOiJodHRwczovL21pbmlzb2Z0LWRldi5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWM1NGY1ZjM2YTViM2E3NDUzZGFkYzAzIiwiYXVkIjpbInRhc3BhZC1kZXYtYXBpLWF1ZCIsImh0dHBzOi8vbWluaXNvZnQtZGV2LmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1NDkxMDczNDcsImV4cCI6MTU0OTExNDU0NywiYXpwIjoicWROZkN4aW9VZTVaSzZUejFod2tOUzB6Vzg4bmppdGIiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.p-ToDQ5GGSmxcEzF2Fd5Qcs6UnXa0stoAGyvAVzB4YVOFC2dS-UQODE36s9YOoSejJceaRinUHB3V26GgqMhOGaQJriKfixCBk8VG5pWEio2vGiMmTpDOj3i_Yfk1PK_ZQGe0YfXrEKbdWRtwzGQcapLZj2cirQ35vM1Wcb0gzdBD_2MMPY-Ujpy-3g5YwFKIOIHXptkx9x04GVxZxQYZHtCJusmMU4T37pu5Cd6b8vfqhkhuXyD7K8KSnMxNo_R4EVq0TGVK2Uf7A90WdT7fCHkkSDcyE0qZRHBIr11fYMMFvv7QRSVonvoQ-OQtd0V-mg_4qWcU-TpqL2xRY5ZYg';

describe('query tests', () => {
  let testTasks = [];

  before(async () => {
    testTasks = makeTestTasks(-10, 10);
    await cleanAndCreateTestTasksInDB(testTasks);
  });

  it('should get pending tasks', done => {
    const getFilter = task => {
      return !task.completed;
    };
    const endpoint = `${TASKS_ENDPOINT}?pending=true`;
    testForFilter(endpoint, getFilter, done);
  });

  it('should get today tasks', done => {
    const daysToAdjust = 0;

    const getFilter = task => {
      return isSameDate(task.due, daysToAdjust);
    };
    const endpoint = getEndpoingForDateQuery(daysToAdjust);
    testForFilter(endpoint, getFilter, done);
  });

  it('should get yesterday tasks', done => {
    const daysToAdjust = -1;

    const getFilter = task => {
      return isSameDate(task.due, daysToAdjust);
    };
    const endpoint = getEndpoingForDateQuery(daysToAdjust);
    testForFilter(endpoint, getFilter, done);
  });

  it('should get tomorrow tasks', done => {
    const daysToAdjust = 1;

    const getFilter = task => {
      return isSameDate(task.due, daysToAdjust);
    };
    const endpoint = getEndpoingForDateQuery(daysToAdjust);
    testForFilter(endpoint, getFilter, done);
  });

  it('should get this week tasks', done => {
    const weekDelta = 0;

    const { from, to } = getWeekStartAndEnd(weekDelta);
    const endpoint = `${TASKS_ENDPOINT}?from=${from}&to=${to}`;
    const getFilter = task => {
      return (
        moment(task.due).isSameOrAfter(from) &&
        moment(task.due).isSameOrBefore(to)
      );
    };
    testForFilter(endpoint, getFilter, done);
  });

  it('should get next week tasks', done => {
    const weekDelta = 1;

    const { from, to } = getWeekStartAndEnd(weekDelta);
    const endpoint = `${TASKS_ENDPOINT}?from=${from}&to=${to}`;
    const getFilter = task => {
      return (
        moment(task.due).isSameOrAfter(from) &&
        moment(task.due).isSameOrBefore(to)
      );
    };
    testForFilter(endpoint, getFilter, done);
  });

  it('should get previous week tasks', done => {
    const weekDelta = -1;

    const { from, to } = getWeekStartAndEnd(weekDelta);
    const endpoint = `${TASKS_ENDPOINT}?from=${from}&to=${to}`;
    const getFilter = task => {
      return (
        moment(task.due).isSameOrAfter(from) &&
        moment(task.due).isSameOrBefore(to)
      );
    };
    testForFilter(endpoint, getFilter, done);
  });

  const testForFilter = (endpoint, getFilter, done) => {
    const expectedTaskTitles = testTasks
      .filter(t => getFilter(t))
      .map(t => t.title);
    request
      .get(endpoint)
      .set({
        'Content-Type': 'application-json',
        Authorization: `Bearer ${authToken}`
      })
      .then(res => {
        const actualTaskTitles = res.body.tasks.map(t => t.title);
        expect(actualTaskTitles).toEqual(expectedTaskTitles);
        done();
      })
      .catch(err => {
        done(err);
      });
  };
});
