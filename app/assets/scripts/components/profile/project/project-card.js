import React from 'react';
import styled from 'styled-components';
import DetailsList from '../../common/details-list';
import ProjectMap from './project-map';
import { media } from '@devseed-ui/theme-provider';
import { formatDateTime } from '../../../utils/format';
import T from 'prop-types';
import get from 'lodash.get';

const ProjectContainer = styled.div`
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 1fr;
  justify-items: center;
  grid-auto-rows: auto 1fr;
  ${media.smallUp`
    grid-template-columns: auto 1fr;
    align-items: flex-start;
    justify-items: flex-start;
  `}
`;

function ProjectCard({ project, shares }) {
  const bounds = get(shares, '[0].aoi.bounds');

  let details = {};

  if (project) {
    details = {
      Created: formatDateTime(project.created),
      Model: project.model_name,
      'Last Checkpoint':
        project.checkpoints.length > 0
          ? project.checkpoints[0].name
          : 'No checkpoints',
      'Exported Maps': shares.length || 'None',
    };
  }
  return (
    <ProjectContainer>
      {bounds ? <ProjectMap bounds={bounds} /> : null}
      <DetailsList details={details} />
    </ProjectContainer>
  );
}

ProjectCard.propTypes = {
  project: T.object,
  shares: T.array,
};

export default ProjectCard;
