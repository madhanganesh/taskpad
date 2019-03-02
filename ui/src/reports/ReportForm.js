import React, { Component } from 'react';

import ReportFormMain from './ReportFormMain';
import PieGroupDetails from './report-piechart-details/PieGroupDetails';

class ReportForm extends Component {
  state = {
    showPiegroupDetail: false,
    uniqueTags: new Set(),
    pieGroups: []
  };

  onAddPieGroup = () => {
    this.setState({
      showPiegroupDetail: true
    });
  };

  onCancelPiegroupDetail = () => {
    this.setState({
      showPiegroupDetail: false
    });
  };

  onPieGroupSave = (name, spec, uniqueTags) => {
    this.setState({
      showPiegroupDetail: false
    });
    this.setState({
      pieGroups: [...this.state.pieGroups, { name, spec }]
    });

    uniqueTags.forEach(t => this.state.uniqueTags.add(t));
  };

  onSaveReport = report => {
    const uniqueTags = [];
    for (let tag of this.state.uniqueTags.values()) {
      uniqueTags.push(tag);
    }
    report.spec.tags = uniqueTags;
    this.props.onSaveReport(report);
  };

  render() {
    return (
      <div className="report-form">
        <ReportFormMain
          pieGroups={this.state.pieGroups}
          onAddPieGroup={this.onAddPieGroup}
          onCancelEditReport={this.props.onCancelEditReport}
          onSaveReport={this.onSaveReport}
        />
        {this.state.showPiegroupDetail ? (
          <PieGroupDetails
            onPieGroupSave={this.onPieGroupSave}
            onCancelPiegroupDetail={this.onCancelPiegroupDetail}
          />
        ) : null}
      </div>
    );
  }
}

export default ReportForm;
