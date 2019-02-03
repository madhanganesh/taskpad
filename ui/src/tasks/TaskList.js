import React, { Component } from 'react';
import Toolbar from './Toolbar';
import moment from 'moment';

import { BarLoader } from 'react-spinners';
import { GoIssueReopened } from 'react-icons/go';

class TaskList extends Component {
  onEditTask = task => {
    if (!task.dirty || task.error !== undefined) {
      this.props.onEditTask(task);
    }
  };

  onToggleDone = task => {
    const toggledTask = { ...task, completed: !task.completed };
    this.props.onSaveTask(toggledTask, 'update');
  };

  onRetrySaveTask = task => {
    if (!['create', 'update', 'delete'].includes(task.cud)) {
      throw new Error('The task sent for retry is not having CUD operation');
    }

    this.props.onSaveTask(task, task.cud);
  };

  renderTasks() {
    return this.props.tasks.map((task, index) => {
      const dateStr = moment(task.due).format('Do MMM');
      const className =
        task.dirty && task.error === undefined
          ? 'flex task task-dirty'
          : 'flex task';
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
              loading={task.dirty && task.error === undefined}
            />
          </span>
          {task.error !== undefined ? (
            <span className="task-right" title={task.error}>
              <GoIssueReopened
                title={task.error}
                style={{ color: 'red', cursor: 'pointer' }}
                onClick={() => this.onRetrySaveTask(task)}
              />
            </span>
          ) : (
            <span className="task-right" />
          )}
          <span className="task-due">{dateStr}</span>
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
