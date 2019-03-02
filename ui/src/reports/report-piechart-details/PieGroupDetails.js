import React, { Component } from 'react';

import PieGroupRule from './PieGroupRule';
import logger from '../../utils/logger';

class PieGroupDetails extends Component {
  state = {
    name: '',
    rules: []
  };

  componentDidMount() {
    this.onRuleAdd();
  }

  onNameChange = event => {
    this.setState({
      name: event.target.value.replace(/\s/g, '')
    });
  };

  onRuleChanged = (id, updatedRule) => {
    const rules = this.state.rules.map(rule => {
      return rule.id === id ? { id, rule: updatedRule } : rule;
    });

    this.setState({
      rules: rules
    });
  };

  getRuleStr = () => {
    /*const rules = this.state.rules.map(r => r.rule);
    const rulesStr = rules.join(' ');
    return `(${rulesStr})`;

    /*let rule = `(${tags.join(' and ')})`;
    rule = this.props.firstRule ? rule : `${this.state.filter} ${rule}`;*/

    const rules = this.state.rules.map(r => r.rule);
    const rulesStrArr = rules.map(r => {
      let str = `(${r.tags.join(' and ')})`;
      str = r.operator ? ` ${r.operator} ${str}` : str;
      return str;
    });
    return rulesStrArr.join(' ');
  };

  onRuleAdd = () => {
    const id = this.state.rules.length;
    this.setState({
      rules: [
        ...this.state.rules,
        { id: id, rule: { operator: undefined, tags: [] } }
      ]
    });
  };

  onRuleDelete = id => {
    if (id === 0) {
      logger.warning(`${id} is not expected to delete.`);
      return;
    }

    const except = this.state.rules.filter(
      r => parseInt(r.id) !== parseInt(id)
    );

    this.setState({
      rules: except
    });
  };

  onPieGroupSave = event => {
    event.preventDefault();
    const ruleStr = this.getRuleStr();

    const tagSet = new Set();
    this.state.rules.forEach(r => {
      r.rule.tags.forEach(t => {
        tagSet.add(t);
      });
    });
    const uniqueTags = [];
    for (let tag of tagSet.values()) {
      uniqueTags.push(tag);
    }

    this.props.onPieGroupSave(this.state.name, ruleStr, uniqueTags);
  };

  onCancel = event => {
    event.preventDefault();
    this.props.onCancelPiegroupDetail();
  };

  canSave = () => {
    const { name, rules } = this.state;

    return name !== '' && name !== ' ' && rules[0].rule.tags.length > 0;
  };

  renderRules() {
    return this.state.rules.map(rule => {
      const id = rule.id;

      const firstRule = id === 0;

      return (
        <PieGroupRule
          key={id}
          id={id}
          firstRule={firstRule}
          onRuleAdd={this.onRuleAdd}
          onRuleDelete={this.onRuleDelete}
          onRuleChanged={this.onRuleChanged}
        />
      );
    });
  }

  render() {
    return (
      <form className="pie-group-detail">
        <h4>Pie Group</h4>
        <p>
          <label htmlFor="title">Name</label>
          <input
            id="title"
            type="text"
            name="pie group name"
            value={this.state.name}
            onChange={this.onNameChange}
            autoFocus
            placeholder="name of pie group"
          />
        </p>
        <div>
          <label htmlFor="title">Selection Rules</label>
          {this.renderRules()}
        </div>
        <div id="rule">{this.getRuleStr()}</div>
        <div className="pie-group-detail__controls">
          <button onClick={this.onPieGroupSave} disabled={!this.canSave()}>
            Save
          </button>
          <button onClick={this.onCancel}>Cancel</button>
        </div>
      </form>
    );
  }
}

export default PieGroupDetails;
