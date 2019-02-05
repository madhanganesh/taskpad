import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import CreatableSelect from 'react-select/lib/Creatable';

class TaskDetail extends Component {
  constructor(props) {
    super(props);
    const { task } = this.props;
    this.state = {
      task: {
        ...task,
        due: moment(task.due).toDate()
      },
      tags: []
    };
  }

  onSaveTask = event => {
    event.preventDefault();
    this.props.onSaveTask(
      this.state.task,
      this.state.task.id === undefined ? 'create' : 'update'
    );
  };

  onDeleteTask = event => {
    event.preventDefault();
    this.props.onSaveTask(this.state.task, 'delete');
  };

  onCancelEditTask = event => {
    event.preventDefault();
    this.props.onCancelEditTask();
  };

  onDueDateChange = date => {
    this.setState({
      task: { ...this.state.task, due: date }
    });
  };

  onTitleChange = event => {
    this.setState({
      task: { ...this.state.task, title: event.target.value }
    });
  };

  onEffortChange = event => {
    this.setState({
      task: { ...this.state.task, effort: parseFloat(event.target.value) }
    });
  };

  onNotesChange = event => {
    this.setState({
      task: { ...this.state.task, notes: event.target.value }
    });
  };

  onTagChange = selectedTags => {
    const tags = selectedTags.map(k => k.value);
    this.setState({
      task: { ...this.state.task, tags: tags }
    });
  };

  render() {
    const { id, title, due, effort, tags, notes } = this.state.task;
    const tagsSelectDefaultValues = tags.map(t => ({ value: t, label: t }));
    const alltags = this.props.usertags.map(t => ({ value: t, label: t }));

    const customStyles = {
      control: styles => {
        return {
          ...styles,
          minHeight: 0,
          padding: 0,
          borderRadius: 0
        };
      },
      container: styles => ({
        ...styles,
        minHeight: 0,
        padding: 0,

        borderRadius: 0
      }),
      valueContainer: styles => {
        return {
          ...styles,
          minHeight: 0,
          padding: 0,
          borderRadius: 0
        };
      },
      dropdownIndicator: styles => {
        return {
          ...styles,
          display: 'none'
        };
      },
      clearIndicator: styles => {
        return {
          ...styles,
          display: 'none'
        };
      },
      indicatorSeparator: styles => {
        return {
          ...styles,
          display: 'none'
        };
      },
      indicatorsContainer: styles => {
        return {
          ...styles,
          display: 'none'
        };
      },
      multiValueRemove: styles => {
        return {
          ...styles,
          display: 'none'
        };
      }
    };

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
              value={title}
              onChange={this.onTitleChange}
              autoFocus
              placeholder="title of the task"
            />
          </p>
          <div>
            <label htmlFor="due">Due</label>
            <span>
              <DatePicker
                selected={due}
                dateFormat="d MMM yyyy"
                onChange={this.onDueDateChange}
              />
            </span>
          </div>
          <p>
            <label htmlFor="effort">Effort</label>
            <input
              id="effort"
              type="number"
              step="0.5"
              value={effort}
              onChange={this.onEffortChange}
              name="effort"
              placeholder="effort to complete in days (eg 1.5)"
            />
          </p>
          <div>
            <label htmlFor="tags">Tags</label>
            <CreatableSelect
              placeholder="enter each tag and press enter"
              styles={customStyles}
              defaultValue={tagsSelectDefaultValues}
              isMulti
              onChange={this.onTagChange}
              options={alltags}
            />
          </div>
          <p>
            <label htmlFor="notes">Notes</label>
            <textarea
              className="tasknotes"
              id="notes"
              type="text"
              name="tags"
              value={notes}
              onChange={this.onNotesChange}
              placeholder="task notes"
              rows="4"
            />
          </p>
          <button onClick={this.onSaveTask}>Save</button>
          {id !== undefined ? (
            <button onClick={this.onDeleteTask}>Delete</button>
          ) : null}
          <button onClick={this.onCancelEditTask}>Cancel</button>
        </form>
      </div>
    );
  }
}

export default TaskDetail;
