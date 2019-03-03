import React, { Component } from 'react';

import Toolbar from './Toolbar';
import ReportCreateView from './report-create/ReportCreateView';
import ReportsView from './reports-display/ReportsView';

import httpApi from '../utils/http-api';
import notifier from '../utils/notifier';
import logger from '../utils/logger';

class ReportsPage extends Component {
  state = {
    showReportCreate: false,
    loading: false,
    reports: []
  };

  componentWillMount() {
    this.loadReports();
  }

  loadReports = async () => {
    this.setState({
      loading: true
    });

    httpApi.getWithErrorHandled(`/api/reports`).then(reports => {
      this.setState({
        reports: reports,
        loading: false
      });
    });
  };

  onAddReport = () => {
    this.setState({
      showReportCreate: true
    });
  };

  onReload = () => {
    this.loadReports();
  };

  onSaveReport = async report => {
    this.setState({
      showReportCreate: false,
      loading: true
    });

    logger.log('Craeting report ' + JSON.stringify(report));

    const err = await httpApi.post('/api/reports', report);
    if (err) {
      notifier.showError(
        `Error in saving the report. Pleas check and create again`
      );
    }

    this.loadReports();
  };

  onCancelEditReport = () => {
    this.setState({
      showReportCreate: false
    });
  };

  onDeleteReport = async id => {
    const err = await httpApi.delete(`/api/reports/${id}`);
    if (err) {
      notifier.showError('Error in deleting the report. Pleas try again');
    }
    this.loadReports();
  };

  render() {
    return (
      <div className="column-main tile">
        <Toolbar
          count={this.state.reports.length}
          onAddReport={this.onAddReport}
          onReload={this.onReload}
          loading={this.state.loading}
        />

        {this.state.showReportCreate ? (
          <ReportCreateView
            onSaveReport={this.onSaveReport}
            onCancelEditReport={this.onCancelEditReport}
          />
        ) : null}

        {this.state.loading ? null : (
          <ReportsView
            reports={this.state.reports}
            onDeleteReport={this.onDeleteReport}
          />
        )}
      </div>
    );
  }
}

export default ReportsPage;
