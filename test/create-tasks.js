const expect = require('expect');
const request = require('superagent');

const {
  cleanTasksTable,
  makeTestTasks,
  retrieveTaskById,
  TASKS_ENDPOINT
} = require('./utils');

const authToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJESkZSRGt6UlRrd09VSTJPVEV5UlRjMk5qTTVNa0ZEUmpFelJEVkVOemhDUkRBMlFUUXdOdyJ9.eyJpc3MiOiJodHRwczovL21pbmlzb2Z0LWRldi5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWM1NGY1ZjM2YTViM2E3NDUzZGFkYzAzIiwiYXVkIjpbInRhc3BhZC1kZXYtYXBpLWF1ZCIsImh0dHBzOi8vbWluaXNvZnQtZGV2LmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1NDkxMDczNDcsImV4cCI6MTU0OTExNDU0NywiYXpwIjoicWROZkN4aW9VZTVaSzZUejFod2tOUzB6Vzg4bmppdGIiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.p-ToDQ5GGSmxcEzF2Fd5Qcs6UnXa0stoAGyvAVzB4YVOFC2dS-UQODE36s9YOoSejJceaRinUHB3V26GgqMhOGaQJriKfixCBk8VG5pWEio2vGiMmTpDOj3i_Yfk1PK_ZQGe0YfXrEKbdWRtwzGQcapLZj2cirQ35vM1Wcb0gzdBD_2MMPY-Ujpy-3g5YwFKIOIHXptkx9x04GVxZxQYZHtCJusmMU4T37pu5Cd6b8vfqhkhuXyD7K8KSnMxNo_R4EVq0TGVK2Uf7A90WdT7fCHkkSDcyE0qZRHBIr11fYMMFvv7QRSVonvoQ-OQtd0V-mg_4qWcU-TpqL2xRY5ZYg';

describe('create tasks', () => {
  before(done => {
    cleanTasksTable()
      .then(() => done())
      .catch(e => done(e));
  });

  it('should create new task', done => {
    const task = makeTestTasks()[0];
    request
      .post(TASKS_ENDPOINT)
      .send(task)
      .set({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      })
      .then(async res => {
        expect(res.status).toBe(201);
        expect(res.body.task.id).toBeDefined();
        const rtask = await retrieveTaskById(res.body.task.id);
        expect(rtask !== null).toBeTruthy();
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  it('should not create task with invalid body data', done => {
    request
      .post(TASKS_ENDPOINT)
      .send({ title: '' })
      .set({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      })
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
      .set({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      })
      .then(async res => {
        expect(res.status).toBe(201);
        expect(res.body.task.id).toBeDefined();
        const rtask = await retrieveTaskById(res.body.task.id);
        expect(rtask !== null).toBeTruthy();
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  it('should create task with no tags', done => {
    const task = makeTestTasks()[0];
    task.tags = [];
    request
      .post(TASKS_ENDPOINT)
      .send(task)
      .set({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      })
      .then(async res => {
        expect(res.status).toBe(201);
        expect(res.body.task.id).toBeDefined();
        const rtask = await retrieveTaskById(res.body.task.id);
        expect(rtask !== null).toBeTruthy();
        done();
      })
      .catch(err => {
        done(err);
      });
  });
});
