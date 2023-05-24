import React from 'react';
import styled from 'styled-components';

import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
} from '../../styles/inpage';
import Map from './map';
import { PrimePanel } from './prime-panel';
import SecPanel from './sec-panel';

const ProjectPageBody = styled(InpageBody)`
  display: grid;
  grid-template-columns: min-content 1fr min-content;
`;

function ProjectPageMain() {
  return (
    <>
      <Inpage isMapCentric>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <InpageTitle>Project</InpageTitle>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <ProjectPageBody>
          <PrimePanel />
          <section id='welcome-trigger'>
            <Map />
          </section>
          <SecPanel />
        </ProjectPageBody>
      </Inpage>
    </>
  );
}

export default ProjectPageMain;
