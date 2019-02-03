const moment = require('moment');
const expect = require('expect');
const request = require('superagent');

const {
  TASKS_ENDPOINT,
  makeTestTasks,
  cleanAndCreateTestTasksInDB,
  retrieveTaskById
} = require('./utils');

const authToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJESkZSRGt6UlRrd09VSTJPVEV5UlRjMk5qTTVNa0ZEUmpFelJEVkVOemhDUkRBMlFUUXdOdyJ9.eyJpc3MiOiJodHRwczovL21pbmlzb2Z0LWRldi5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWM1NGY1ZjM2YTViM2E3NDUzZGFkYzAzIiwiYXVkIjpbInRhc3BhZC1kZXYtYXBpLWF1ZCIsImh0dHBzOi8vbWluaXNvZnQtZGV2LmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1NDkxMDczNDcsImV4cCI6MTU0OTExNDU0NywiYXpwIjoicWROZkN4aW9VZTVaSzZUejFod2tOUzB6Vzg4bmppdGIiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.p-ToDQ5GGSmxcEzF2Fd5Qcs6UnXa0stoAGyvAVzB4YVOFC2dS-UQODE36s9YOoSejJceaRinUHB3V26GgqMhOGaQJriKfixCBk8VG5pWEio2vGiMmTpDOj3i_Yfk1PK_ZQGe0YfXrEKbdWRtwzGQcapLZj2cirQ35vM1Wcb0gzdBD_2MMPY-Ujpy-3g5YwFKIOIHXptkx9x04GVxZxQYZHtCJusmMU4T37pu5Cd6b8vfqhkhuXyD7K8KSnMxNo_R4EVq0TGVK2Uf7A90WdT7fCHkkSDcyE0qZRHBIr11fYMMFvv7QRSVonvoQ-OQtd0V-mg_4qWcU-TpqL2xRY5ZYg';

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
      .set({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      })
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
      .set({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      })
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
      .set({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      })
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
      .set({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      })
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
      .set({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      })
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
      .set({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      })
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
      .set({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      })
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
      .set({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      })
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
