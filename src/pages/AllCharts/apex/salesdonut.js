import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class Salesdonut extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                dataLabels: {
                    enabled: false,
                },
                legend: {
                    show: false
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '80%'
                        }
                    }
                },
                colors: ['#e74c3c', '#9b59b6', '#34495e', '#f39c12', '#1abc9c'],
                tooltip: {
                    y: {
                      formatter: function (value, { seriesIndex, w }) {
                        // Display the label corresponding to the hovered series
                        const label = props?.labels[seriesIndex]; // Get the label based on seriesIndex
                        return `${label}: ${value}`; // Combine label and value
                      }
                    }
                  }
            },
            series: props.series,
            labels: props?.labels,
        }
    }
    render() {
        return (
            <React.Fragment>
                <ReactApexChart options={this.state.options} series={this.state.series} type="donut" height="180" className="apex-charts" />
            </React.Fragment>
        );
    }
}

export default Salesdonut;