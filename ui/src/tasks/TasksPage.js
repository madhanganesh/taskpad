import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

import TaskList from './TaskList';
import TaskDetail from './TaskDetail';
import { getQueryParamsForFilter } from '../utils/utils';

class TasksPage extends Component {
  state = {
    tasks: [],
    editTask: null,
    filter: 'pending',
    loading: false
  };

  async componentDidMount() {
    this.loadTasksWithIndicator();
  }

  async loadTasksWithIndicator() {
    this.setState({
      loading: true
    });
    await this.loadTasks();
    this.setState({
      loading: false
    });
  }

  async loadTasks() {
    const filter = getQueryParamsForFilter(this.state.filter);
    const result = await axios.get(`/api/tasks?${filter}`, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${this.props.auth.getAccessToken()}`
      }
    });
    this.setState({
      tasks: result.data.tasks.map(t => ({ ...t, dirty: false }))
    });
  }

  onTaskFilterChange = event => {
    this.setState(
      {
        filter: event.target.value
      },
      () => this.loadTasksWithIndicator()
    );
  };

  onReload = () => {
    this.loadTasksWithIndicator();
  };

  onAddTask = () => {
    this.setState({
      editTask: {
        title: '',
        due: moment().toISOString(),
        completed: false,
        effort: 1,
        tags: ['architecture', 'meeting'],
        notes: ''
      }
    });
  };

  onEditTask = task => {
    this.setState({
      editTask: task
    });
  };

  onSaveTask = async task => {
    this.setState({
      editTask: null
    });

    const dirtyTask = { ...task, dirty: true };
    if (dirtyTask.id !== undefined) {
      const newTasks = this.state.tasks.map(t => {
        return t.id !== dirtyTask.id ? t : dirtyTask;
      });

      this.setState({
        tasks: newTasks
      });
      await axios.put(`/api/tasks/${task.id}`, task, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${this.props.auth.getAccessToken()}`
        }
      });

      this.loadTasks();
    } else {
      this.setState({
        tasks: [...this.state.tasks, dirtyTask]
      });
      await axios.post(`/api/tasks`, dirtyTask, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${this.props.auth.getAccessToken()}`
        }
      });

      this.loadTasks();
    }
  };

  onDeleteTask = async task => {
    this.setState({
      editTask: null
    });

    if (task.id !== undefined) {
      const dirtyTask = { ...task, dirty: true };
      this.setState({
        tasks: this.state.tasks.filter(t => t.id !== dirtyTask.id)
      });
      await axios.delete(`/api/tasks/${dirtyTask.id}`, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${this.props.auth.getAccessToken()}`
        }
      });
    }
  };

  onCancelEditTask = () => {
    this.setState({
      editTask: null
    });
  };

  renderMetrics() {
    return (
      <div className="column-sidebar tile">
        <h3>Task Metrics to come here....</h3>
      </div>
    );
  }

  renderTaskDetail = () => {
    return (
      <TaskDetail
        task={this.state.editTask}
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
          onReload={this.onReload}
          onSaveTask={this.onSaveTask}
        />

        {this.state.editTask ? this.renderTaskDetail() : this.renderMetrics()}
      </main>
    );
  }
}

export default TasksPage;
