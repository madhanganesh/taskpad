import React, { Component } from 'react';

import { BarLoader } from 'react-spinners';

class Toolbar extends Component {
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
        <div className="sweet-loading toobar-loader">
          <BarLoader
            sizeUnit={'px'}
            height={6}
            width={300}
            color={'#cc6b5a'}
            loading={this.props.loading}
          />
        </div>
      </div>
    );
  }
}

export default Toolbar;
