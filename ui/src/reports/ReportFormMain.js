import React, { Component } from 'react';

import PieChartDetails from './report-piechart-details/PieChartDetails';

class ReportFormMain extends Component {
  state = {
    title: ''
  };

  onAddPieGroup = e => {
    e.preventDefault();
    this.props.onAddPieGroup();
  };

  onSaveReport = e => {
    e.preventDefault();
    let spec = {};
    if (this.props.pieGroups.length !== 0) {
      spec = this.props.pieGroups;
    }

    const report = {
      title: this.state.title,
      type: 'pie',
      spec: {
        groups: spec
      }
    };

    this.props.onSaveReport(report);
  };

  onCancelEditReport = e => {
    e.preventDefault();
    this.props.onCancelEditReport();
  };

  canSave = () => {
    const { title } = this.state;

    return title !== '' && title !== ' ' && this.props.pieGroups.length !== 0;
  };

  onTitleChange = event => {
    this.setState({
      title: event.target.value
    });
  };

  render() {
    return (
      <form className="report-form-main">
        <h3>Report Details</h3>
        <p>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="Title of the Report"
            value={this.state.title}
            onChange={this.onTitleChange}
            autoFocus
            placeholder="title of the report"
          />
        </p>
        <p>
          <label htmlFor="charttype">Type</label>
          <select>
            <option value="piechart">Piechart</option>
          </select>
        </p>

        <div>
          <label htmlFor="charttype">Pie Groups</label>
          <PieChartDetails
            pieGroups={this.props.pieGroups}
            onAddPieGroup={this.onAddPieGroup}
          />
        </div>

        <div className="report-form-main-controls">
          <button onClick={this.onSaveReport} disabled={!this.canSave()}>
            Save
          </button>
          <button onClick={this.onCancelEditReport}>Cancel</button>
        </div>
      </form>
    );
  }
}

export default ReportFormMain;
