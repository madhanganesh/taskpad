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
