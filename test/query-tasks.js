const moment = require('moment');
const expect = require('expect');
const request = require('superagent');

const {
  TASKS_ENDPOINT,
  makeTestTasks,
  createTestTasksInDB,
  getEndpoingForDateQuery,
  getWeekStartAndEnd,
  isSameDate
} = require('./utils');

let testTasks = [];

beforeEach(async () => {
  testTasks = makeTestTasks(-10, 10);
  await createTestTasksInDB(testTasks);
});

const testForFilter = (endpoint, getFilter, done) => {
  const expectedTaskTitles = testTasks
    .filter(t => getFilter(t))
    .map(t => t.title);
  request
    .get(endpoint)
    .then(res => {
      const actualTaskTitles = res.body.tasks.map(t => t.title);
      expect(actualTaskTitles).toEqual(expectedTaskTitles);
      done();
    })
    .catch(err => {
      done(err);
    });
};

describe('tasks query by status', () => {
  it('should get pending tasks', done => {
    const getFilter = task => {
      return !task.completed;
    };
    const endpoint = `${TASKS_ENDPOINT}?pending=true`;
    testForFilter(endpoint, getFilter, done);
  });
});

describe('tasks query by dates', () => {
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
});
