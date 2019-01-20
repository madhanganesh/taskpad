const expect = require('expect');
const request = require('superagent');

const {
  cleanTasksTable,
  makeTestTasks,
  retrieveTaskById,
  TASKS_ENDPOINT
} = require('./utils');

beforeEach(done => {
  cleanTasksTable()
    .then(() => done())
    .catch(e => done(e));
});

describe('create tasks', () => {
  it('should create new task', done => {
    const task = makeTestTasks()[0];
    request
      .post(TASKS_ENDPOINT)
      .send(task)
      .set('Content-Type', 'application/json')
      .then(async res => {
        expect(res.status).toBe(201);
        expect(res.body.task.id).toBeDefined();
        const rtask = await retrieveTaskById(res.body.task.id);
        expect(rtask !== null).toBeTruthy();
        done();
      })
      .catch(err => {
        done(err.response.error);
      });
  });

  it('should not create task with invalid body data', done => {
    request
      .post(TASKS_ENDPOINT)
      .send({ title: '' })
      .set('Content-Type', 'application/json')
      .then(() => {
        done('invalid operation');
      })
      .catch(err => {
        expect(err.response.statusCode).toBe(400);
        expect(JSON.parse(err.response.error.text).error).toBe(
          'title should not be empty'
        );
        done();
      });
  });

  it('should create task with tags', done => {
    const task = makeTestTasks()[0];
    request
      .post(TASKS_ENDPOINT)
      .send(task)
      .set('Content-Type', 'application/json')
      .then(async res => {
        expect(res.status).toBe(201);
        expect(res.body.task.id).toBeDefined();
        const rtask = await retrieveTaskById(res.body.task.id);
        expect(rtask !== null).toBeTruthy();
        done();
      })
      .catch(err => {
        done(err.response.error);
      });
  });

  it('should create task with no tags', done => {
    const task = makeTestTasks()[0];
    task.tags = [];
    request
      .post(TASKS_ENDPOINT)
      .send(task)
      .set('Content-Type', 'application/json')
      .then(async res => {
        expect(res.status).toBe(201);
        expect(res.body.task.id).toBeDefined();
        const rtask = await retrieveTaskById(res.body.task.id);
        expect(rtask !== null).toBeTruthy();
        done();
      })
      .catch(err => {
        done(err.response.error);
      });
  });
});
