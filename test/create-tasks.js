const expect = require('expect');
const request = require('superagent');

const {
  cleanTasksTable,
  makeTestTasks,
  retrieveTaskById,
  TASKS_ENDPOINT
} = require('./utils');

const authToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJESkZSRGt6UlRrd09VSTJPVEV5UlRjMk5qTTVNa0ZEUmpFelJEVkVOemhDUkRBMlFUUXdOdyJ9.eyJpc3MiOiJodHRwczovL21pbmlzb2Z0LWRldi5hdXRoMC5jb20vIiwic3ViIjoidjNRVnR0eW9uOXBBRVFOUk1sY1NDaEtOOXhRT0xtTXhAY2xpZW50cyIsImF1ZCI6InRhc3BhZC1kZXYtYXBpLWF1ZCIsImlhdCI6MTU0ODI5ODQwOCwiZXhwIjoxNTQ4Mzg0ODA4LCJhenAiOiJ2M1FWdHR5b245cEFFUU5STWxjU0NoS045eFFPTG1NeCIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.Gu7Zr-Z0sSavkpcU6h94MiVX2b_c_TjzcGrPVYmjCgVtJ5picsPPN7KKH2aECdre-Kcz3_CAXXZRhHqky3JurdvDwaebmRDdItEhWVg9p0gcpsvs_5CwhvxEqxQYtiLwR2SreX4j8djrpK_a-9rOxOgF_ldjgziDnS1yIwGNG9HJabvFBN7BMbhYR4vwgaUmvQi4b-PvE94mxZW8JI_RHmdvt7lctDrJ9rb0qaSXJvqo2T0Y9iNiQhw301Xt-IiW73tW0Gm76R4R3aXJOYlJa3HzUVa580ED6A-j98t3BPuFoapeT2zEW65NihpLs3M1ajUlWSm-NE9xTM9Uzn5axw';

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
