import React, { Component } from 'react';

import Toolbar from './Toolbar';
import ReportForm from './ReportForm';
import ReportsView from './reporstview/ReportsView';

import httpApi from '../utils/http-api';
import notifier from '../utils/notifier';

class ReportsPage extends Component {
  state = {
    showReportsForm: false,
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
        loading: false
      });

      if (reports) {
        this.setState({
          reports: reports
        });
      }
    });
  };

  onAddReport = () => {
    this.setState({
      showReportsForm: true
    });
  };

  onReload = () => {
    this.loadReports();
  };

  onSaveReport = async report => {
    this.setState({
      showReportsForm: false,
      loading: true
    });

    try {
      await httpApi.post('/api/reports', report);
    } catch (e) {}

    const err = await httpApi.post('/api/report', report);
    if (err) {
      notifier.showError(
        `Error in saving the report. Pleas check and create again`
      );
    }

    this.loadReports();
  };

  onCancelEditReport = () => {
    this.setState({
      showReportsForm: false
    });
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

        {this.state.showReportsForm ? (
          <ReportForm
            onSaveReport={this.onSaveReport}
            onCancelEditReport={this.onCancelEditReport}
          />
        ) : null}

        {this.state.loading ? null : (
          <ReportsView reports={this.state.reports} />
        )}
      </div>
    );
  }
}

export default ReportsPage;
