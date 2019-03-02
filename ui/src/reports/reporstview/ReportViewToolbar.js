import React, { Component } from 'react';

class ReportViewToolbar extends Component {
  render() {
    const { report } = this.props;
    return (
      <div className="report-view__toolbar">
        <span className="report-view__toolbar__title">{report.title}</span>
      </div>
    );
  }
}

export default ReportViewToolbar;
