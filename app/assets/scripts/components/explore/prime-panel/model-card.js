import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import DetailsList from '../../common/details-list';
import { Bar } from 'react-chartjs-2';

const CardContainer = styled.div``;

const ChartContainer = styled.div``;

const CardTitle = styled.div``;

const CardSubtitle = styled.div``;

function ModelCard({ model, onClick }) {
  const details = {
    Imagery: model.meta.imagery,
    'Imagery Resolution': model.meta.imagery_resolution,
    'Global F1 Score': model.meta.f1_weighted,
  };

  const barChartOptions = {
    legend: {
      display: false,
    },
    tooltips: {
      intersect: false,
      enabled: true,
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
    <CardContainer>
      <ChartContainer>
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
      </ChartContainer>
      <CardTitle onClick={onClick}>{model.name}</CardTitle>
      <CardSubtitle>{model.meta.description}</CardSubtitle>
      <DetailsList details={details} />
    </CardContainer>
  );
}

ModelCard.propTypes = {
  model: T.object,
  onClick: T.func,
};

export default ModelCard;
