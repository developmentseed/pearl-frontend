import React from 'react';
import DetailsList from '../../common/details-list';
import ProjectMap from './project-map';
import styled from 'styled-components';
import { formatDateTime } from '../../../utils/format';

const ProjectContainer = styled.div``;

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
