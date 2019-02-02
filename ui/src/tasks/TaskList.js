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

  onToggleDone = task => {
    const toggledTask = { ...task, completed: !task.completed };
    this.props.onSaveTask(toggledTask);
  };

  renderTasks() {
    return this.props.tasks.map((task, index) => {
      const dateStr = moment(task.due).format('Do MMM');
      const className = task.dirty ? 'flex task task-dirty' : 'flex task';
      return (
        <li key={index} className={className}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => this.onToggleDone(task)}
          />
          <span className="task-title" onClick={() => this.onEditTask(task)}>
            {task.title}
          </span>
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
      tasks,
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
            count={tasks.length}
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
