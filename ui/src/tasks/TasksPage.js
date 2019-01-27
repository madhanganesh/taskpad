import React, { Component } from 'react';
import axios from 'axios';

class TasksPage extends Component {
  state = {
    profile: null,
    error: '',
    tasks: []
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

  render() {
    return (
      <>
        <h3>Tasks</h3>
        {this.renderTasks()}
      </>
    );
  }
}

export default TasksPage;
