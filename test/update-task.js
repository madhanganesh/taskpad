const moment = require('moment');
const expect = require('expect');
const request = require('superagent');

const {
  TASKS_ENDPOINT,
  makeTestTasks,
  cleanAndCreateTestTasksInDB,
  retrieveTaskById
} = require('./utils');

describe('update tests', () => {
  let testTask;
  let endpoint;

  beforeEach(async () => {
    const testTasks = makeTestTasks(0, 1);
    await cleanAndCreateTestTasksInDB(testTasks);
    testTask = testTasks[0];
    endpoint = `${TASKS_ENDPOINT}/${testTask.id}`;
  });

  it('should update completed flag', done => {
    testTask.completed = !testTask.completed;
    request
      .put(endpoint)
      .send(testTask)
      .set('Content-Type', 'application/json')
      .then(async res => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe(`${testTask.id} updated`);
        const retrievedTask = await retrieveTaskById(testTask.id);
        expect(retrievedTask).toEqual(testTask);
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  it('should update only the fields provided without changing original fields', done => {
    const partialTask = {
      title: 'only title updated'
    };
    request
      .put(endpoint)
      .send(partialTask)
      .set('Content-Type', 'application/json')
      .then(async res => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe(`${testTask.id} updated`);
        const retrievedTask = await retrieveTaskById(testTask.id);
        expect(retrievedTask).toEqual({ ...testTask, ...partialTask });
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  it('should update tags with empty array', done => {
    const partialTask = {
      tags: []
    };
    request
      .put(endpoint)
      .send(partialTask)
      .set('Content-Type', 'application/json')
      .then(async res => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe(`${testTask.id} updated`);
        const retrievedTask = await retrieveTaskById(testTask.id);
        expect(retrievedTask).toEqual({ ...testTask, ...partialTask });
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  it('should update tags', done => {
    const partialTask = {
      tags: ['tag-2']
    };
    request
      .put(endpoint)
      .send(partialTask)
      .set('Content-Type', 'application/json')
      .then(async res => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe(`${testTask.id} updated`);
        const retrievedTask = await retrieveTaskById(testTask.id);
        expect(retrievedTask).toEqual({ ...testTask, ...partialTask });
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  it('should update due field', done => {
    //'YYYY-MM-DDTHH:mm:ss:SSSz'
    const now = moment();
    const partialTask = {
      due: now.utc().toISOString()
    };
    request
      .put(endpoint)
      .send(partialTask)
      .set('Content-Type', 'application/json')
      .then(async res => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe(`${testTask.id} updated`);
        const retrievedTask = await retrieveTaskById(testTask.id);
        //expect(retrievedTask).toEqual({ ...testTask, ...partialTask });
        expect(now.isSame(moment(retrievedTask.due))).toBeTruthy();
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  it('should update effort field', done => {
    const partialTask = {
      effort: testTask.effort + 0.5
    };
    request
      .put(endpoint)
      .send(partialTask)
      .set('Content-Type', 'application/json')
      .then(async res => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe(`${testTask.id} updated`);
        const retrievedTask = await retrieveTaskById(testTask.id);
        expect(retrievedTask).toEqual({ ...testTask, ...partialTask });
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  it('should update note field', done => {
    const partialTask = {
      notes: 'this is test note updated'
    };
    request
      .put(endpoint)
      .send(partialTask)
      .set('Content-Type', 'application/json')
      .then(async res => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe(`${testTask.id} updated`);
        const retrievedTask = await retrieveTaskById(testTask.id);
        expect(retrievedTask).toEqual({ ...testTask, ...partialTask });
        done();
      })
      .catch(err => {
        done(err.response.error);
      });
  });

  it('should update multiple fields', done => {
    const partialTask = {
      effort: 0.5,
      notes: 'this is test note updated'
    };
    request
      .put(endpoint)
      .send(partialTask)
      .set('Content-Type', 'application/json')
      .then(async res => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe(`${testTask.id} updated`);
        const retrievedTask = await retrieveTaskById(testTask.id);
        expect(retrievedTask).toEqual({ ...testTask, ...partialTask });
        done();
      })
      .catch(err => {
        done(err.response.error);
      });
  });
});
