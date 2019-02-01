import React, { Component } from 'react';
import Toolbar from './Toolbar';
import moment from 'moment';

import { BarLoader } from 'react-spinners';

class TaskList extends Component {
  onEditTask = task => {
    if (!task.dirty) {
      this.props.onEditTask(task);
    }
  };

  renderTasks() {
    return this.props.tasks.map((task, index) => {
      const dateStr = moment(task.due).format('Do MMM');
      const className = task.dirty ? 'flex task task-dirty' : 'flex task';
      return (
        <li
          key={index}
          className={className}
          onClick={() => this.onEditTask(task)}
        >
          <input type="checkbox" />
          <span className="task-title">{task.title}</span>
          <span className="sweet-loading toobar-loader">
            <BarLoader
              sizeUnit={'px'}
              height={4}
              width={100}
              color={'#cc6b5a'}
              loading={task.dirty}
            />
          </span>
          <span className="task-right">{dateStr}</span>
        </li>
      );
    });
  }

  render() {
    const {
      loading,
      filter,
      onTaskFilterChange,
      onAddTask,
      onReload
    } = this.props;

    return (
      <div className="column-main tile">
        <div className="flex tasksarea">
          <Toolbar
            loading={loading}
            filter={filter}
            onTaskFilterChange={onTaskFilterChange}
            onAddTask={onAddTask}
            onReload={onReload}
          />

          <ul className="tasks">{this.renderTasks()}</ul>
        </div>
      </div>
    );
  }
}

export default TaskList;
