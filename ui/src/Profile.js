import React, { Component } from 'react';
import axios from 'axios';

class Profile extends Component {
  state = {
    profile: null,
    error: '',
    tasks: []
  };

  componentDidMount() {
    //this.loadUserProfile();
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
      return <h3>{task.title}</h3>;
    });
  }

  render() {
    return (
      <>
        <h1>Tasks</h1>
        {this.renderTasks()}
      </>
    );
  }

  render1() {
    const { profile } = this.state;
    if (!profile) return null;
    return (
      <>
        <h1>Profile</h1>
        <p>{profile.nickname}</p>
        <img
          style={{ maxWidth: 50, maxHeight: 50 }}
          src={profile.picture}
          alt="profile pic"
        />
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </>
    );
  }
}

export default Profile;
