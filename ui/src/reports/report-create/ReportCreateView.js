import React, { Component } from 'react';

import PieChartCreateView from './PieChartCreateView';

class LineChartDetails extends Component {
  render() {
    return (
      <p>
        <label htmlFor="linechart">Line Chart not yet implemented!</label>
      </p>
    );
  }
}

class ReportCreateView extends Component {
  state = {
    title: '',
    chartTypes: [
      { value: 'pie', display: 'Pie Chart' },
      { value: 'line', display: 'Line Chart' }
    ],
    selectedChartType: 'pie',
    spec: {}
  };

  onTitleChange = event => {
    this.setState({
      title: event.target.value
    });
  };

  onSaveReport = event => {
    event.preventDefault();

    const report = {
      title: this.state.title,
      type: this.state.selectedChartType,
      spec: this.state.spec
    };
    this.props.onSaveReport(report);
  };

  onSpecUpdate = spec => {
    this.state.spec = spec; // eslint-disable-line
  };

  onCancelEditReport = e => {
    e.preventDefault();
    this.props.onCancelEditReport();
  };

  canSave = () => {
    const { title, selectedChartType } = this.state;
    return title !== '' && title !== ' ' && selectedChartType === 'pie';
  };

  onChartTypeChange = event => {
    const value = event.target.value;
    this.setState({
      selectedChartType: value
    });
  };

  renderChartTypes() {
    return this.state.chartTypes.map(type => {
      return (
        <option key={type.value} value={type.value}>
          {type.display}
        </option>
      );
    });
  }

  renderChartCreateView() {
    const { selectedChartType } = this.state;

    if (selectedChartType === 'pie') {
      return (
        <PieChartCreateView
          reportTitle={this.state.title}
          onSpecUpdate={this.onSpecUpdate}
        />
      );
    }

    if (selectedChartType === 'line') {
      return <LineChartDetails />;
    }

    return null;
  }

  render() {
    return (
      <div className="report-create-view">
        <h3 className="report-create-view__heading">Create Report</h3>
        <form className="report-create-view__form">
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
            <label htmlFor="charttype">Chart Type</label>
            <select onChange={this.onChartTypeChange}>
              {this.renderChartTypes()}
            </select>
          </p>

          {this.renderChartCreateView()}

          <div className="report-create-view__form__controls">
            <button onClick={this.onSaveReport} disabled={!this.canSave()}>
              Save
            </button>
            <button onClick={this.onCancelEditReport}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

export default ReportCreateView;
