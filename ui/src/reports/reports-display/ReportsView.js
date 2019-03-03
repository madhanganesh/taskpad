import React, { Component } from 'react';

import ReportView from './ReportView';

class ReportsView extends Component {
  renderReports() {
    return this.props.reports.map(report => {
      return (
        <ReportView
          key={report.id}
          report={report}
          onDeleteReport={this.props.onDeleteReport}
        />
      );
    });
  }

  render() {
    return <div className="reports-view">{this.renderReports()}</div>;
  }
}

export default ReportsView;
