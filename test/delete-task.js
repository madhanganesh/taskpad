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
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJESkZSRGt6UlRrd09VSTJPVEV5UlRjMk5qTTVNa0ZEUmpFelJEVkVOemhDUkRBMlFUUXdOdyJ9.eyJpc3MiOiJodHRwczovL21pbmlzb2Z0LWRldi5hdXRoMC5jb20vIiwic3ViIjoidjNRVnR0eW9uOXBBRVFOUk1sY1NDaEtOOXhRT0xtTXhAY2xpZW50cyIsImF1ZCI6InRhc3BhZC1kZXYtYXBpLWF1ZCIsImlhdCI6MTU0ODI5ODQwOCwiZXhwIjoxNTQ4Mzg0ODA4LCJhenAiOiJ2M1FWdHR5b245cEFFUU5STWxjU0NoS045eFFPTG1NeCIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.Gu7Zr-Z0sSavkpcU6h94MiVX2b_c_TjzcGrPVYmjCgVtJ5picsPPN7KKH2aECdre-Kcz3_CAXXZRhHqky3JurdvDwaebmRDdItEhWVg9p0gcpsvs_5CwhvxEqxQYtiLwR2SreX4j8djrpK_a-9rOxOgF_ldjgziDnS1yIwGNG9HJabvFBN7BMbhYR4vwgaUmvQi4b-PvE94mxZW8JI_RHmdvt7lctDrJ9rb0qaSXJvqo2T0Y9iNiQhw301Xt-IiW73tW0Gm76R4R3aXJOYlJa3HzUVa580ED6A-j98t3BPuFoapeT2zEW65NihpLs3M1ajUlWSm-NE9xTM9Uzn5axw';

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
      .set({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      })
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
