import React, { Component } from 'react';
import moment from 'moment';
import getUrls from 'get-urls';

import { BarLoader } from 'react-spinners';
import ReactTooltip from 'react-tooltip';
import { GoIssueReopened } from 'react-icons/go';
import { IoMdLink, IoMdCopy, IoIosCodeDownload } from 'react-icons/io';

import Toolbar from './Toolbar';
import { getNextWorkingDay } from '../utils/utils';

class TaskList extends Component {
  state = {
    taskUnderMouse: undefined
  };

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

  onLinkClicked = link => {
    window.open(link);
  };

  onMouseEnter = task => {
    this.setState({
      taskUnderMouse: task.id
    });
  };

  onMouseLeave = task => {
    this.setState({
      taskUnderMouse: undefined
    });
  };

  duplicateTaskForNextWorkingDay = task => {
    const newTask = {
      ...task,
      id: undefined,
      due: getNextWorkingDay(task.due)
    };
    this.props.onSaveTask(newTask, 'create');
  };

  moveDueToNextWorkingDay = task => {
    const updatedTask = { ...task, due: getNextWorkingDay(task.due) };
    this.props.onSaveTask(updatedTask, 'update');
  };

  renderTasks() {
    return this.props.tasks.map((task, index) => {
      const dateStr = moment(task.due).format('Do MMM');
      const className =
        task.dirty && task.error === undefined
          ? 'flex task task-dirty'
          : 'flex task';

      let links = [];
      const linkset = getUrls(task.notes);
      linkset.forEach(link => {
        if (links.length > 2) return;
        const linkitem = (
          <span data-tip={link} key={links.length}>
            <IoMdLink
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => this.onLinkClicked(link)}
            />
          </span>
        );
        links.push(linkitem);
      });

      let actionsForTaskUnderMouse = null;
      if (this.state.taskUnderMouse === task.id && !task.dirty) {
        actionsForTaskUnderMouse = (
          <span>
            <ReactTooltip />
            <IoIosCodeDownload
              data-tip="move this task to next working day"
              style={{ color: 'green', cursor: 'pointer' }}
              onClick={() => this.moveDueToNextWorkingDay(task)}
            />
            <IoMdCopy
              data-tip="duplicate this task for next working day"
              style={{ color: 'green', cursor: 'pointer' }}
              onClick={() => this.duplicateTaskForNextWorkingDay(task)}
            />
          </span>
        );
      }

      return (
        <li
          key={index}
          className={className}
          onMouseEnter={() => this.onMouseEnter(task)}
          onMouseLeave={() => this.onMouseLeave(task)}
        >
          <ReactTooltip />
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
          <span>{actionsForTaskUnderMouse}</span>
          <span>{links}</span>
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
