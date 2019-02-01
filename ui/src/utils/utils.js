import moment from 'moment';

function getQueryParamsForFilter(filter) {
  if (filter === 'pending') {
    return 'pending=true';
  }

  if (filter === 'today') {
    const { from, to } = getDayStartAndEnd(0);
    return `from=${from}&to=${to}`;
  }

  if (filter === 'tomorrow') {
    const { from, to } = getDayStartAndEnd(1);
    return `from=${from}&to=${to}`;
  }

  if (filter === 'yesterday') {
    const { from, to } = getDayStartAndEnd(-1);
    return `from=${from}&to=${to}`;
  }

  if (filter === 'thisweek') {
    const { from, to } = getWeekStartAndEnd(0);
    return `from=${from}&to=${to}`;
  }

  if (filter === 'nextweek') {
    const { from, to } = getWeekStartAndEnd(1);
    return `from=${from}&to=${to}`;
  }

  if (filter === 'lastweek') {
    const { from, to } = getWeekStartAndEnd(-1);
    return `from=${from}&to=${to}`;
  }
}

function getDayStartAndEnd(dayDeltaFromToday) {
  const day = moment().add(dayDeltaFromToday, 'day');
  const from = day
    .utc()
    .startOf('day')
    .toISOString();
  const to = day
    .utc()
    .endOf('day')
    .toISOString();
  return { from, to };
}

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

export { getQueryParamsForFilter, getDayStartAndEnd, getWeekStartAndEnd };
