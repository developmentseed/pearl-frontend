import React from 'react';
import styled from 'styled-components';
import DetailsList from '../../common/details-list';
import ProjectMap from './project-map';
import { media } from '@devseed-ui/theme-provider';
import { formatDateTime } from '../../../utils/format';

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

function getDetails(project, aois) {
  if (!project) {
    return {};
  }
  return {
    Created: formatDateTime(project.created),
    Model: project.model_name,
    'Last Checkpoint':
      project.checkpoints.length > 0
        ? project.checkpoints[0].name
        : 'No checkpoints',
    AOIS: aois.length,
    'AOI Name': aois.length > 0 ? aois[0].name : '',
  };
}

function ProjectCard({ project, aois }) {
  const hasAoi = aois.length > 0;
  const bounds = hasAoi ? aois[0].bounds : null;
  const details = getDetails(project, aois);
  return (
    <ProjectContainer>
      {hasAoi ? <ProjectMap bounds={bounds} /> : null}
      <DetailsList details={details} />
    </ProjectContainer>
  );
}

export default ProjectCard;
