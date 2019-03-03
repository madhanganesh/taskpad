import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { IoIosInformationCircleOutline, IoIosTrash } from 'react-icons/io';

import httpApi from '../../utils/http-api';
import notifier from '../../utils/notifier';

class ReportViewToolbar extends Component {
  onDeleteReport = report => {
    this.props.onDeleteReport(report.id);
  };

  showReportSpec = report => {
    httpApi
      .get(`/api/chartdata/${report.id}`)
      .then(data => {
        let spec = {};
        if (data.type === 'pie') {
          spec = data.spec.groups.map(g => ({ name: g.name, spec: g.spec }));
        }
        alert(JSON.stringify(spec));
      })
      .catch(e => {
        notifier.showError(e.message);
      });
  };

  closeModal = () => {
    this.setState({ openSpecInfo: false });
  };

  render() {
    const { report } = this.props;
    return (
      <div className="report-view__toolbar">
        <ReactTooltip />
        <span className="report-view__toolbar__title">{report.title}</span>
        <span className="report-view_toolbar__controls">
          <IoIosInformationCircleOutline
            data-tip="click to retrieve the report specification"
            style={{ color: 'black', cursor: 'pointer', marginRight: '5px' }}
            onClick={() => this.showReportSpec(report)}
          />
          <IoIosTrash
            data-tip="delete this report"
            style={{ color: 'black', cursor: 'pointer' }}
            onClick={() => this.onDeleteReport(report)}
          />
        </span>
      </div>
    );
  }
}

export default ReportViewToolbar;
