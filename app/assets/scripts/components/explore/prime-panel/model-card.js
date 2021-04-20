import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import { Card } from '../../common/card-list';

const ChartContainer = styled.div`
  height: 12rem;
  max-width: 100%;
  position: relative;
`;

function ModelCard({ model, onClick }) {
  const details = {
    Imagery: model.meta.imagery,
    'Imagery Resolution': model.meta.imagery_resolution,
    'Global F1 Score': model.meta.f1_weighted,
  };

  const barChartOptions = {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltips: {
      intersect: false,
      enabled: true,
      callbacks: {
          label: (tooltipItem, data) => {
              let label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label) {
                  label += ': ';
              }
              label += Math.round(tooltipItem.yLabel * 100) / 100;
              return label;
          }
      },
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            display: false,
            maxTicksLimit: 1,
            fontSize: 12,
            // callback: (v) => `${v * 100}%`,
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
  };

  const classes = model.classes.map((c) => {
    return {
      ...c,
      distribution: model.meta.class_distribution[c.name],
    };
  });
  return (
    <Card
      title={model.name}
      subtitle={model.meta.description}
      details={details}
      expanded
      borderlessMedia
      cardMedia={
        <Bar
          data={{
            datasets: [
              {
                label: '',
                data: classes.map((c) => c.distribution),
                backgroundColor: classes.map((c) => c.color),
              },
            ],
            labels: classes.map((c) => c.name),
          }}
          options={barChartOptions}
        />
      }
      onClick={onClick}
    >
    </Card>
  );
}

ModelCard.propTypes = {
  model: T.object,
  onClick: T.func,
};

export default ModelCard;
