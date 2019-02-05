import React from 'react';
import Chart from 'react-google-charts';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import { BarLoader } from 'react-spinners';

let options = {
  hAxis: { title: 'time spent', textPosition: 'none' },
  vAxis: { slantedText: true, slantedTextAngle: 90 },
  titleTextStyle: {
    fontFamily: 'Raleway',
    fontSize: '12',
    bold: false,
    italic: false
  },
  width: '100%',
  chartArea: {
    top: 10,
    left: 40,
    width: '100%',
    height: '80%'
  }
};

class TaskMetrics extends React.Component {
  renderToolBar() {
    const { onMetricsPrev, onMetricsNext } = this.props;

    return (
      <div className="toolbar">
        <span className="nav" data-tip="previous week" onClick={onMetricsPrev}>
          {'<'}
        </span>

        <span className="title">Time Spent - Daily</span>
        <span className="nav" data-tip="next week" onClick={onMetricsNext}>
          {'>'}
        </span>
      </div>
    );
  }

  renderSecondToolBar() {
    const { metrics } = this.props;
    let metricRange = 'Task efforts';
    let totalEffort = 0;
    if (metrics.length > 0) {
      const fromDate = moment(metrics[0].day).format('Do MMM');
      const toDate = moment(metrics[metrics.length - 1].day).format('Do MMM');
      metricRange = `${fromDate} - ${toDate}`;

      totalEffort = metrics
        .map(m => m.effort)
        .reduce((prev, next) => prev + next);
    }

    const loadingIndicator = (
      <BarLoader
        sizeUnit={'px'}
        width={50}
        height={5}
        color={'#cc6b5a'}
        loading={this.props.loading}
      />
    );

    return (
      <div className="secondtoolbar">
        <span>{metricRange}</span>
        <span>{loadingIndicator}</span>
        <span>{totalEffort} hours</span>
      </div>
    );
  }

  renderGraph() {
    let data = [];
    const { metrics } = this.props;
    if (metrics.length > 0) {
      data = [['Day', 'Hours', { role: 'annotation' }]];
      metrics.forEach(m => {
        const day = moment(m.day).format('ddd');
        const effort = parseFloat(m.effort);
        data = [...data, [day, effort, `${effort} h`]];
      });
      return <Chart chartType="BarChart" data={data} options={options} />;
    }
    return null;
  }

  render() {
    return (
      <div className="taskmetrics">
        <ReactTooltip />
        {this.renderToolBar()}
        {this.renderSecondToolBar()}
        {this.renderGraph()}
      </div>
    );
  }
}
//{loading ? this.renderLoader() : this.renderGraph()}

export default TaskMetrics;
