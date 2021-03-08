import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';
import CardList, { Card } from '../../common/card-list';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
} from '../../../styles/inpage';
import { glsp } from '@devseed-ui/theme-provider';
import { StyledNavLink } from '../../../styles/links';

const ProjectsBody = styled(InpageBody)`
  display: grid;
  grid-template-columns: 1fr 4fr;
  padding: 0 ${glsp(4)};
`;
const CardResults = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
`;

const NavPane = styled.div`
  .active::before {
    content: '-';
  }
`;
const NavList = styled.ol``;

function Projects(props) {
  const { projectsList } = props;
  const { projects } = projectsList.isReady() ? projectsList.getData() : {};
  return (
    <>
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gridTemplateRows: '1fr',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <InpageTitle>Projects</InpageTitle>
              <Button
                forwardedAs={StyledNavLink}
                to='/explore'
                variation='base-raised-semidark'
                useIcon={['plus', 'after']}
                title='Launch application'
                style={{
                  alignSelf: 'center',
                }}
              >
                New Project
              </Button>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <ProjectsBody>
          <NavPane>
            <NavList>
              <li>
                <StyledNavLink to='/profile/projects' className='active'>
                  {' '}
                  Projects
                </StyledNavLink>
              </li>
              <li>
                <StyledNavLink to='/profile/maps'> Maps</StyledNavLink>
              </li>
            </NavList>
          </NavPane>

          {projects && (
            <CardList
              numColumns={1}
              data={projects}
              renderCard={(proj) => (
                <Card
                  id={proj.id}
                  title={proj.name}
                  key={proj.id}
                  details={{
                    edited: proj.created,
                    model: proj.model || 'No model set',
                    checkpoint: proj.checkpoint || 'No checkpoint set',
                    aoi: proj.aoi || 'No AOI set',
                    results: (
                      <CardResults>
                        <Button
                          variation='base-raised-semidark'
                          useIcon={['clipboard', 'after']}
                          size='small'
                        >
                          Saved url
                        </Button>
                        <Button
                          variation='base-raised-semidark'
                          useIcon={['download', 'after']}
                          size='small'
                        >
                          Download
                        </Button>
                      </CardResults>
                    ),
                  }}
                  cardMedia={
                    <img
                      width='100%'
                      src='https://place-hold.it/120x68/#dbdbd'
                    />
                  }
                  size='large'
                  // onClick = set current project
                />
              )}
            />
          )}
        </ProjectsBody>
      </Inpage>
    </>
  );
}

Projects.propTypes = {
  projectsList: T.object,
};
export default Projects;
