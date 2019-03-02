import React, { Component } from 'react';

import ReportView from './ReportView';

class ReportsView extends Component {
  renderReports() {
    return this.props.reports.map(report => {
      return <ReportView report={report} />;
    });
  }

  render() {
    return <div className="reports-view">{this.renderReports()}</div>;
  }
}

export default ReportsView;
