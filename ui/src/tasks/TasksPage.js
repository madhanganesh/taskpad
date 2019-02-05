import React, { Component } from 'react';
import moment from 'moment';

import TaskList from './TaskList';
import TaskDetail from './TaskDetail';
import TaskMetrics from './TaskMetrics';
import httpApi from '../utils/http-api';
import notifier from '../utils/notifier';
import { getQueryParamsForFilter, getWeekStartAndEnd } from '../utils/utils';

class TasksPage extends Component {
  state = {
    tasks: [],
    usertags: [],
    editTask: null,
    filter: 'pending',
    loading: false,
    metrics: [],
    metricsLoading: false,
    metricsWeekNr: 0
  };

  async componentDidMount() {
    this.loadTasks();
  }

  loadTasks = async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) {
      this.setState({
        loading: true
      });
    }

    const filter = getQueryParamsForFilter(this.state.filter);
    httpApi.getWithErrorHandled(`/api/tasks?${filter}`).then(data => {
      this.setState({
        loading: false
      });

      if (data) {
        this.setState({
          tasks: data.tasks.map(t => ({ ...t, dirty: false, error: undefined }))
        });
      }
    });

    this.loadMetrics(this.state.metricsWeekNr);
  };

  loadMetrics = async (delta, showLoader = true) => {
    if (showLoader) {
      this.setState({ metricsLoading: true });
    }
    const { from, to } = getWeekStartAndEnd(delta);
    const data = await httpApi.getWithErrorHandled(
      `/api/taskmetrics/daily?from=${from}&to=${to}`
    );
    this.setState({ metricsLoading: false });
    if (data) {
      this.setState({
        metricsWeekNr: delta,
        metrics: data.metrics
      });
    }
  };

  loadUserTags = async () => {
    const url = `/api/usertags`;
    const warning = 'Error while retrieving your tags';
    const data = await httpApi.getWithWarningHandled(url, warning);
    if (data) {
      this.setState({
        usertags: data.tags
      });
    }
  };

  onTaskFilterChange = event => {
    const state = { filter: event.target.value };
    this.setState(state, () => this.loadTasks());
  };

  onAddTask = () => {
    this.setState({
      editTask: {
        title: '',
        due: moment().toISOString(),
        completed: false,
        effort: 1,
        tags: [],
        notes: ''
      }
    });
    this.loadUserTags();
  };

  onEditTask = task => {
    this.setState({
      editTask: task
    });
    this.loadUserTags();
  };

  onSaveTask = async (task, cud) => {
    const { tasks } = this.state;
    const dirtyTask = { ...task, dirty: true, error: undefined, cud: cud };
    const updatedTasks = this._getUpdatedTasks(tasks, dirtyTask, cud);

    this.setState({
      editTask: null,
      tasks: updatedTasks
    });

    const err = await this._doCud(dirtyTask, cud);
    if (err) {
      notifier.showError(`Error is ${cud} operation. Please retry`);
      dirtyTask.error = `Error is ${cud} operation. Please click here to retry`;
      this.forceUpdate();
      return;
    }

    this.loadTasks(false);
  };

  onCancelEditTask = () => {
    this.setState({
      editTask: null
    });
  };

  onMetricsPrev = () => {
    this.loadMetrics(this.state.metricsWeekNr - 1);
  };

  onMetricsNext = () => {
    this.loadMetrics(this.state.metricsWeekNr + 1);
  };

  renderMetrics() {
    const { metricsLoading, metrics } = this.state;

    return (
      <div className="column-sidebar tile">
        <TaskMetrics
          loading={metricsLoading}
          metrics={metrics}
          onMetricsPrev={this.onMetricsPrev}
          onMetricsNext={this.onMetricsNext}
        />
      </div>
    );
  }

  renderTaskDetail = () => {
    return (
      <TaskDetail
        task={this.state.editTask}
        usertags={this.state.usertags}
        onSaveTask={this.onSaveTask}
        onDeleteTask={this.onDeleteTask}
        onCancelEditTask={this.onCancelEditTask}
      />
    );
  };

  render() {
    const { tasks, filter, loading } = this.state;
    return (
      <main className="flex taskpage">
        <TaskList
          loading={loading}
          tasks={tasks}
          filter={filter}
          onAddTask={this.onAddTask}
          onEditTask={this.onEditTask}
          onTaskFilterChange={this.onTaskFilterChange}
          onReload={this.loadTasks}
          onSaveTask={this.onSaveTask}
        />

        {this.state.editTask ? this.renderTaskDetail() : this.renderMetrics()}
      </main>
    );
  }

  // perform Create, Updae or Delete
  _doCud = async (task, cud) => {
    if (cud === 'create') {
      return httpApi.post(`/api/tasks`, task);
    }
    if (cud === 'update') {
      return httpApi.put(`/api/tasks/${task.id}`, task);
    }

    if (cud === 'delete') {
      return httpApi.delete(`/api/tasks/${task.id}`);
    }

    throw new Error(
      `CUD should be either create or update or delete. Received ${cud}`
    );
  };

  _getUpdatedTasks = (tasks, dirtyTask, cud) => {
    if (cud === 'update' || cud === 'delete') {
      return tasks.map(t => {
        return t.id !== dirtyTask.id ? t : dirtyTask;
      });
    }

    if (cud === 'create') {
      return [...tasks, dirtyTask];
    }

    throw new Error(
      `CUD should be either create or update or delete. Received ${cud}`
    );
  };
}

export default TasksPage;
