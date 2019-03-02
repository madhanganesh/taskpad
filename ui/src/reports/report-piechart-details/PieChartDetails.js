import React, { Component } from 'react';

class PiechartDetails extends Component {
  renderPieGroups() {
    if (this.props.pieGroups.length === 0) {
      return 'Press Add to configure selection criteria for querying a Pie';
    }
    return this.props.pieGroups.map(group => {
      return <span className="pie-chart-details__group">{group.name}</span>;
    });
  }

  render() {
    const { onAddPieGroup } = this.props;

    return (
      <div className="pie-chart-details">
        <div className="pie-chart-details__groups">
          {this.renderPieGroups()}
          <button className="pie-chart-details__add" onClick={onAddPieGroup}>
            Add
          </button>
        </div>
      </div>
    );
  }
}

export default PiechartDetails;
