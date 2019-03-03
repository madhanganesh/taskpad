import React, { Component } from 'react';

import ReactTooltip from 'react-tooltip';
import { IoIosAddCircleOutline, IoIosTrash } from 'react-icons/io';

import PieGroupEditView from './PieGroupEditView';

class PieChartCreateView extends Component {
  state = {
    pieGroups: [],
    newPieGroup: false,
    editPieGroup: undefined,
    uniqueTags: []
  };

  onPiegroupAdd = () => {
    if (this.props.reportTitle === '' || this.props.reportTitle === ' ') {
      alert('Enter valid report title to proceed');
      return;
    }

    this.setState({
      newPieGroup: true
    });
  };

  onEditPieGroup = pieGroup => {
    this.setState({
      editPieGroup: pieGroup
    });
  };

  onDeletePieGroup = group => {
    const newGroups = this.state.pieGroups.filter(g => g.name !== group.name);
    this.setState({
      pieGroups: newGroups
    });
  };

  renderPieGroups() {
    const renderPieGroupToView = group => {
      return (
        <div>
          <ReactTooltip />
          <div
            key={group.name}
            data-tip={group.spec}
            className="pie-chart-details__group"
          >
            <span>{group.name}</span>
            <span
              className="pie-chart-details__group__controls"
              data-tip="delete this pie group"
            >
              <IoIosTrash
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => this.onDeletePieGroup(group)}
              />
            </span>
          </div>
        </div>
      );
    };

    if (this.state.pieGroups.length === 0 && !this.state.newPieGroup) {
      return <span>(Add filter criteria to select data for a Pie)</span>;
    }

    return this.state.pieGroups.map(group => {
      return renderPieGroupToView(group);
    });
  }

  onPieGroupSave = (name, spec, rules, groupTags) => {
    this.setState(
      {
        pieGroups: [...this.state.pieGroups, { name, spec }],
        uniqueTags: [...new Set([...this.state.uniqueTags, ...groupTags])],
        newPieGroup: false,
        editPieGroup: undefined
      },
      () => {
        const spec = {
          tags: this.state.uniqueTags,
          groups: this.state.pieGroups
        };

        this.props.onSpecUpdate(spec);
      }
    );
  };

  onCancelPieGroupDetail = () => {
    this.setState({
      newPieGroup: false,
      editPieGroup: undefined
    });
  };

  renderNewPiegroup() {
    if (!this.state.newPieGroup) return null;

    return (
      <PieGroupEditView
        onPieGroupSave={this.onPieGroupSave}
        onCancelPieGroupDetail={this.onCancelPieGroupDetail}
      />
    );
  }

  render() {
    return (
      <div className="pie-chart-details">
        <label htmlFor="piegroups">Pie Chart Groups</label>
        <div className="pie-chart-details__body">
          <div className="pie-chart-details__groups">
            {this.renderPieGroups()}
            {this.renderNewPiegroup()}
          </div>
          <span
            data-tip="Add filter criteria to select data for a Pie"
            className="pie-chart-details__controls"
          >
            <ReactTooltip />
            <IoIosAddCircleOutline
              size={20}
              style={{ cursor: 'pointer' }}
              onClick={this.onPiegroupAdd}
            />
          </span>
        </div>
      </div>
    );
  }
}

export default PieChartCreateView;
