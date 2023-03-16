import React from 'react';
import styled from 'styled-components';

import { themeVal, glsp, media, truncated } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Form } from '@devseed-ui/form';
import { ProjectMachineContext } from '../../context/project-xstate';
import { Modal } from '../common/custom-modal';

const Wrapper = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-gap: ${glsp()};
  align-items: center;
  ${media.mediumDown`
    grid-template-columns: 1fr auto;
  `}
`;

const ProjectHeading = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  line-height: 1.5;
  max-width: 14rem;
  z-index: 5;
  p {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    ${media.mediumDown`
      display: none;
    `}
  }
  ${Heading} {
    margin: 0 ${glsp(0.25)};
    height: auto;
    padding: ${glsp(0.25)} ${glsp(0.5)};
    line-height: 1.5rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    max-height: 2rem;
    overflow: hidden;
    &:hover {
      border: 1px solid ${themeVal('color.baseAlphaE')};
    }
    ${truncated()}
  }
  ${Form} {
    grid-gap: ${glsp(0.5)};
    align-items: center;
    justify-items: center;
  }
`;

const selectors = {
  isEnteringProjectName: (state) => state.matches('Entering new project name'),
};

function ProjectPageHeader() {
  const isEnteringProjectName = ProjectMachineContext.useSelector(
    selectors.isEnteringProjectName
  );

  return (
    <Wrapper>
      <ProjectHeading>
        <p>Project:</p>
        <Heading size='xsmall' data-cy='project-name'>
          Project name
        </Heading>
      </ProjectHeading>

      <Modal
        id='project-name-modal'
        data-cy='project-name-modal'
        title='New project'
        // Reveal modal on mount for new projects, not existing ones
        revealed={isEnteringProjectName}
        size='small'
        closeButton={true}
        onCloseClick={() => history.push('/profile/projects')}
      />
    </Wrapper>
  );
}

ProjectPageHeader.propTypes = {};

export default ProjectPageHeader;
