const moment = require('moment');

function getWeekStartAndEnd(weekDeltaFromThisWeek) {
  const daysAdjustedForWeekDelta = weekDeltaFromThisWeek * 7;

  const from = moment()
    .startOf('isoWeek')
    .add(1, 'day')
    .add(daysAdjustedForWeekDelta, 'days')
    .utc()
    .startOf('day')
    .toISOString();
  const to = moment()
    .endOf('isoWeek')
    .add(-2, 'day')
    .add(daysAdjustedForWeekDelta, 'days')
    .utc()
    .endOf('day')
    .toISOString();
  return { from, to };
}

module.exports = {
  getWeekStartAndEnd
};
