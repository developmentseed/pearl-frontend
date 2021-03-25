import React from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
`;
const Summary = styled.ol`
`
const options = {
  defaultFontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  legend: {
    display: false,
  },
  tooltips: {
    intersect: false,
    enabled: false
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          display: false,
          maxTicksLimit: 2,
          fontSize: 12,
          callback: (v) => `${v * 100}%`,
          min: 0,
          max: 1,
        },
        gridLines: { display: true,
          tickMarkLength: 0
        },
        scaleLabel: {
          display: false,
          labelString: 'Class Distributiuon',
          fontSize: 12,
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          fontSize: 14,
          beginAtZero: true,
          display: false,
        },
        gridLines: { display: false },
        scaleLabel: {
          display: false,
          fontSize: 2,
        },
      },
    ],
  },
  maintainAspectRatio: true,
};
function ClassDistribitionChart(props) {
  const { checkpoint } = props;
  return (
    <Wrapper>
      <Bar
        width='100%'
        height={100}
        data={{
          datasets: [
            {
              label: 'Class Distribution',
              data: checkpoint.analytics.map((c) => c.percent),
              backgroundColor: Object.values(checkpoint.classes).map(
                (c) => c.color
              ),
            },
          ],
          labels: Object.values(checkpoint.classes).map((c) => c.name),
        }}
        options={options}
      />
      <Summary>
        {
          Object.values(checkpoint.classes).map((c) => <li>c.name</li>)
        }
       </Summary>
    </Wrapper>
  );
}

export default ClassDistribitionChart;
