import React, { Component } from 'react';

import PieChart from './PieChart';
import ReportViewToolbar from './ReportViewToolbar';

class ReportView extends Component {
  renderByReportType() {
    if (this.props.report.type === 'pie') {
      return <PieChart report={this.props.report} />;
    }

    return (
      <span
        style={{
          color: 'red',
          fontStyle: 'bold',
          padding: '1em',
          margin: '1em'
        }}
      >
        Unsupported repot type {this.props.report.type}{' '}
      </span>
    );
  }

  render() {
    return (
      <div className="report-view">
        <ReportViewToolbar
          report={this.props.report}
          onDeleteReport={this.props.onDeleteReport}
        />
        <div className="report-view__chart">{this.renderByReportType()}</div>
      </div>
    );
  }
}

export default ReportView;
