import React, { Component } from 'react';

import { BarLoader } from 'react-spinners';

class Toolbar extends Component {
  getTasksCount() {
    const { count } = this.props;

    if (count === 0) return 'No tasks :-)';
    if (count === 1) return '1 task';
    return `${count} tasks`;
  }

  render() {
    const { onAddTask, onReload, onTaskFilterChange, filter } = this.props;

    return (
      <div className="flex toolbar">
        <button onClick={onAddTask}>Add</button>
        <button onClick={onReload}>Reload</button>
        <select onChange={onTaskFilterChange} value={filter}>
          <option value="pending">Pending</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="yesterday">Yesterday</option>
          <option value="thisweek">This Week</option>
          <option value="nextweek">Next Week</option>
          <option value="lastweek">Last Week</option>
        </select>
        <strong className="count">{this.getTasksCount()}</strong>
        <div className="sweet-loading loader">
          <BarLoader
            sizeUnit={'em'}
            height={7}
            width={200}
            color={'#cc6b5a'}
            loading={this.props.loading}
          />
        </div>
      </div>
    );
  }
}

export default Toolbar;
