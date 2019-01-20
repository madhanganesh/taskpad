const moment = require('moment');
const expect = require('expect');
const request = require('superagent');

const {
  TASKS_ENDPOINT,
  makeTestTasks,
  cleanAndCreateTestTasksInDB,
  retrieveTaskById
} = require('./utils');

describe('delete tests', () => {
  let testTask;
  let endpoint;

  beforeEach(async () => {
    const testTasks = makeTestTasks(0, 1);
    await cleanAndCreateTestTasksInDB(testTasks);
    testTask = testTasks[0];
    endpoint = `${TASKS_ENDPOINT}/${testTask.id}`;
  });

  it('should delete task', done => {
    request
      .delete(endpoint)
      .send(testTask)
      .set('Content-Type', 'application/json')
      .then(async res => {
        //console.log(res.body.message);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe(`${testTask.id} deleted`);
        //const retrievedTask = await retrieveTaskById(testTask.id);
        //expect(retrievedTask).toEqual(testTask);
        done();
      })
      .catch(err => {
        done(err.response.error);
      });
  });
});
