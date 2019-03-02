import React from 'react';
import Chart from 'react-google-charts';

import httpApi from '../../utils/http-api';
import notifier from '../../utils/notifier';

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

class PieChart extends React.Component {
  state = {
    chartData: []
  };

  componentDidMount() {
    httpApi
      .get(`/api/chartdata/${this.props.report.id}`)
      .then(data => {
        let arr = [['Type', 'Effort']];
        for (let key in data.data) {
          const a = [key, data.data[key]];
          arr.push(a);
        }
        this.setState({
          chartData: arr
        });
      })
      .catch(e => {
        notifier.showError(e.message);
      });
  }

  renderGraph() {
    const { chartData } = this.state;

    return (
      <Chart
        width={'400px'}
        height={'200px'}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={chartData}
        options={options}
      />
    );
  }

  render() {
    return <div>{this.renderGraph()}</div>;
  }
}

export default PieChart;
