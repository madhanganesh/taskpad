import React, { Component } from 'react';
import axios from 'axios';

class TasksPage extends Component {
  state = {
    profile: null,
    error: '',
    tasks: [],
    showtask: false
  };

  componentDidMount() {
    this.loadTasks();
  }

  loadUserProfile() {
    this.props.auth.getProfile((profile, error) => {
      this.setState({ profile, error });
    });
  }

  async loadTasks() {
    console.log(this.props.auth.getAccessToken());
    const result = await axios.get('/api/tasks?pending=true', {
      headers: {
        Authorization: `Bearer ${this.props.auth.getAccessToken()}`
      }
    });
    this.setState({
      tasks: result.data.tasks
    });
  }

  renderTasks() {
    return this.state.tasks.map(task => {
      return <h4>{task.title}</h4>;
    });
  }

  newTask = () => {
    this.setState({
      showtask: true
    });
  };

  cancelEditTask = () => {
    this.setState({
      showtask: false
    });
  };

  renderTaskdetail() {
    return (
      <div className="column-sidebar tile">
        <form className="task-form">
          <h3>Task</h3>
          <p>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              autoFocus
              placeholder="title of the task"
            />
          </p>
          <p>
            <label htmlFor="due">Due</label>
            <input
              id="due"
              type="date"
              name="date"
              placeholder="due date to complete"
            />
          </p>
          <p>
            <label htmlFor="effort">Effort</label>
            <input
              id="effort"
              type="number"
              step="0.5"
              name="effort"
              placeholder="effort to complete in days (eg 1.5)"
            />
          </p>
          <p>
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              type="text"
              name="tags"
              placeholder="tags (comma seperated)"
            />
          </p>
          <button onClick={this.addTask}>Save</button>
          <button onClick={this.cancelEditTask}>Cancel</button>
        </form>
      </div>
    );
  }

  renderMetrics() {
    return <div className="column-sidebar tile" />;
  }

  render() {
    return (
      <main className="flex">
        <div className="column-main tile">
          <div className="flex tasksarea">
            <div className="flex toolbar">
              <button onClick={this.newTask}>Add</button>
              <select>
                <option>Pending</option>
                <option>Today</option>
                <option>Tomorrow</option>
                <option>Yesterday</option>
                <option>This Week</option>
                <option>Next Week</option>
                <option>Last Week</option>
              </select>
            </div>

            <ul className="tasks">
              <li className="flex task">
                <input type="checkbox" /> This is task - 1
              </li>
              <li className="flex task">
                <input type="checkbox" /> This is task - 2
              </li>
              <li className="flex task">
                <input type="checkbox" /> This is task - 3
              </li>
            </ul>
          </div>
        </div>

        {this.state.showtask ? this.renderTaskdetail() : this.renderMetrics()}
      </main>
    );
  }
}

export default TasksPage;
