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
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJESkZSRGt6UlRrd09VSTJPVEV5UlRjMk5qTTVNa0ZEUmpFelJEVkVOemhDUkRBMlFUUXdOdyJ9.eyJpc3MiOiJodHRwczovL21pbmlzb2Z0LWRldi5hdXRoMC5jb20vIiwic3ViIjoidjNRVnR0eW9uOXBBRVFOUk1sY1NDaEtOOXhRT0xtTXhAY2xpZW50cyIsImF1ZCI6InRhc3BhZC1kZXYtYXBpLWF1ZCIsImlhdCI6MTU0ODI5ODQwOCwiZXhwIjoxNTQ4Mzg0ODA4LCJhenAiOiJ2M1FWdHR5b245cEFFUU5STWxjU0NoS045eFFPTG1NeCIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.Gu7Zr-Z0sSavkpcU6h94MiVX2b_c_TjzcGrPVYmjCgVtJ5picsPPN7KKH2aECdre-Kcz3_CAXXZRhHqky3JurdvDwaebmRDdItEhWVg9p0gcpsvs_5CwhvxEqxQYtiLwR2SreX4j8djrpK_a-9rOxOgF_ldjgziDnS1yIwGNG9HJabvFBN7BMbhYR4vwgaUmvQi4b-PvE94mxZW8JI_RHmdvt7lctDrJ9rb0qaSXJvqo2T0Y9iNiQhw301Xt-IiW73tW0Gm76R4R3aXJOYlJa3HzUVa580ED6A-j98t3BPuFoapeT2zEW65NihpLs3M1ajUlWSm-NE9xTM9Uzn5axw';

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
