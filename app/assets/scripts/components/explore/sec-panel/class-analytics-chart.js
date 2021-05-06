import React from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import T from 'prop-types';
import Prose from '../../../styles/type/prose';
import { glsp, themeVal, truncated } from '@devseed-ui/theme-provider';
import { round } from '../../../utils/format';

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: ${glsp(7.5)} auto;
  grid-gap: ${glsp(1)};
`;
const Summary = styled.ol`
  display: grid;
  grid-gap: 0.125rem;
`;
const ChartContainer = styled.div`
  background-color: ${themeVal('color.baseAlphaC')};
  max-width: 100%;
`;
const ClassItem = styled.li`
  display: grid;
  grid-gap: 0.75rem;
  grid-template-columns: 0.75rem minmax(10px, 1fr) 2rem;

  ${Prose} {
    text-align: left;
    ${truncated}
  }
  ${Prose}.percent {
    text-align: right;
  }
`;

const Icon = styled.div`
  background-color: ${({ color }) => color};
  width: ${glsp(0.75)};
  height: ${glsp(0.75)};
  align-self: center;
`;

const options = {
  defaultFontFamily:
    "'Titillium Web', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  legend: {
    display: false,
  },
  tooltips: {
    intersect: false,
    enabled: false,
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          display: false,
          maxTicksLimit: 1,
          fontSize: 12,
          callback: (v) => `${v * 100}%`,
          min: 0,
          max: 1,
        },
        gridLines: {
          display: false,
          drawTicks: false,
          tickMarkLength: 0,
          drawBorder: true,
        },
        scaleLabel: {
          display: false,
          labelString: 'Class F1 Score',
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
        gridLines: { display: false, drawTicks: false, drawBorder: false },
        scaleLabel: {
          display: false,
          fontSize: 2,
        },
      },
    ],
  },
  maintainAspectRatio: false,
};
function ClassAnalyticsChart(props) {
  const { checkpoint, label, metric } = props;
  return (
    <Wrapper>
      <ChartContainer>
        <Bar
          data={{
            datasets: [
              {
                label: label,
                data: checkpoint.analytics.map((c) => c[metric]),
                backgroundColor: Object.values(checkpoint.classes).map(
                  (c) => c.color
                ),
              },
            ],
            labels: Object.values(checkpoint.classes).map((c) => c.name),
          }}
          options={options}
        />
      </ChartContainer>
      <Summary>
        {Object.values(checkpoint.classes).map(
          (c, i) =>
            checkpoint.analytics[i] && (
              <ClassItem key={c.name}>
                <Icon color={c.color} />
                <Prose size='small'>{c.name}</Prose>
                <Prose size='small' className='percent'>
                  {metric === 'percent'
                    ? `${round(checkpoint.analytics[i][metric], 2) * 100}%`
                    : round(checkpoint.analytics[i][metric], 2)}
                </Prose>
              </ClassItem>
            )
        )}
      </Summary>
    </Wrapper>
  );
}
ClassAnalyticsChart.propTypes = {
  checkpoint: T.object,
  label: T.string,
  metric: T.string,
};

export default ClassAnalyticsChart;
