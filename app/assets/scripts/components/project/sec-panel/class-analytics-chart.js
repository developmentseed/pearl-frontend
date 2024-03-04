import React from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import T from 'prop-types';
import Prose from '../../../styles/type/prose';
import { glsp, themeVal, truncated } from '@devseed-ui/theme-provider';
import { round } from '../../../utils/format';
import { areaFromBounds } from '../../../utils/map';
import { formatThousands } from '../../../utils/format';

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
  background-color: ${themeVal('color.background')};
  max-width: 100%;
`;
const ClassItem = styled.li`
  display: grid;
  grid-gap: 0.75rem;
  grid-template-columns: ${({ bounds }) =>
    bounds
      ? '0.75rem minmax(10px, 1fr) 4rem 4rem'
      : '0.75rem minmax(10px, 1fr) 2rem'};

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
  const { checkpoint, label, metric, formatter, bounds } = props;
  const landArea = (percentage) => {
    const formatted = formatThousands(
      (percentage * areaFromBounds(bounds)) / 1e6
    );
    return formatted !== '0' ? formatted : '-';
  };
  const prettyPrint = (value, metric) => {
    let formatted;
    if (formatter) {
      formatted = formatter(value, metric);
    } else if (metric === 'percent') {
      formatted = `${round(value, 2) * 100}%`;
    } else {
      formatted = round(value, 2);
    }
    return formatted === '0' || formatted === '0%' ? '-' : formatted;
  };
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
                borderColor: 'rgba(240,244,255,0.24)',
                borderWidth: 1,
              },
            ],
            labels: Object.values(checkpoint.classes).map((c) => c.name),
          }}
          options={options}
        />
      </ChartContainer>
      <Summary>
        {bounds && (
          <ClassItem bounds={bounds}>
            <p> </p>
            <Prose size='small'>CLASS NAME</Prose>
            <Prose size='small' className='percent'>
              AREA KM2
            </Prose>
            <Prose size='small' className='percent'>
              %
            </Prose>
          </ClassItem>
        )}
        {Object.values(checkpoint.classes).map(
          (c, i) =>
            checkpoint.analytics[i] && (
              <ClassItem key={c.name} bounds={bounds}>
                <Icon color={c.color} />
                <Prose size='small'>{c.name}</Prose>
                {bounds && (
                  <Prose size='small' className='percent'>
                    {landArea(checkpoint.analytics[i][metric])}
                  </Prose>
                )}
                <Prose size='small' className='percent'>
                  {prettyPrint(checkpoint.analytics[i][metric], metric)}
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
  bounds: T.string,
  formatter: T.func,
};

export default ClassAnalyticsChart;
