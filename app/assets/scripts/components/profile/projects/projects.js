import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import CardList, { Card } from '../../common/card-list';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
  InpageBodyInner,
} from '../../../styles/inpage';
import { Form, FormInput } from '@devseed-ui/form';
import { glsp, media } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { StyledNavLink } from '../../../styles/links';
import toasts from '../../common/toasts';
import { useHistory } from 'react-router';
import { useAuth, AuthContext, useRestApiClient } from '../../../context/auth';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '@devseed-ui/global-loading';
import Table, {TableRow, TableCell} from '../../common/table';
import Paginator from '../../common/paginator';

// Controls the size of each page
const PROJECTS_PER_PAGE = 20;

const HEADERS = [
  'Name',
  'Edited',
  'Model',
  'Latest Checkpoint',
  'AOIs',
  'AOI Names'
];

const ProjectsBody = styled(InpageBodyInner)`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: auto 1fr;
  grid-gap: ${glsp()};
  padding: 0 ${glsp(4)} ${glsp(4)};
  min-height: 100%;
  ${media.mediumUp`
    grid-template-columns: 1fr 4fr;
    grid-auto-rows: auto;
  `}
`;
const CardResults = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: auto 1fr;
  grid-gap: 1rem;
  ${media.mediumUp`
    grid-template-columns: 2fr 1fr;
    grid-auto-rows: auto;
  `}
`;

const FormInputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 2.125rem;

  > :first-child:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  > :last-child:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form__control::selection {
    background-color: unset;
    color: unset;
  }
`;

const NavPane = styled.div`
  .active::before {
    content: '-';
  }
`;
const NavList = styled.ol`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  > * {
    padding: ${glsp(0.5)};
  }
  ${media.mediumUp`
    flex-flow: column;
  `}
`;

// Render single projects row
function renderRow(proj) {
  return (
    <TableRow key={proj.id}>
      <TableCell>
        {proj.name}
      </TableCell>
      <TableCell>
        {proj.created}
      </TableCell>
      <TableCell>
        {proj.model ? proj.model.name : 'No model set'}
      </TableCell>
      <TableCell>
        {proj.checkpoint || 'No checkpoint set'}
      </TableCell>
      <TableCell>
        {proj.aoi || 'No AOI set'}
      </TableCell>
      <TableCell>
        FIXME: AOI Names
      </TableCell>
    </TableRow>
  );
}

function Projects() {
  const history = useHistory();

  const { apiToken } = useAuth();

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);

  const [projects, setProjects] = useState([]);

  const { restApiClient } = useRestApiClient();

  useEffect(async () => {
    if (apiToken) {
      showGlobalLoadingMessage('Loading projects...');
      try {
        const data = await restApiClient.getProjects(page, PROJECTS_PER_PAGE);
        console.log('projects data', data);
        setTotal(data.total);
        setProjects(data.projects);
      } catch (err) {
        toasts.error('Failed to fetch projects.');
        hideGlobalLoading();
      }
      hideGlobalLoading();
    }
  }, [apiToken, page]);

  const numPages = Math.ceil(total / PROJECTS_PER_PAGE);


  // const [projectsList, dispatchProjectsList] = useReducer(
  //   createQueryApiGetReducer('project'),
  //   initialApiRequestState
  // );

  // useEffect(() => {
  //   if (apiToken) {
  //     queryApiGet({ token: apiToken, endpoint: 'project' })(
  //       dispatchProjectsList
  //     );
  //   }
  // }, [apiToken]); // eslint-disable-line react-hooks/exhaustive-deps

  // const { projects } = projectsList.isReady() ? projectsList.getData() : {};
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
                to='/project/new'
                variation='primary-raised-light'
                size='large'
                useIcon={['plus', 'after']}
                title='Start a new project'
                style={{
                  alignSelf: 'center',
                }}
              >
                New Project
              </Button>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
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

            {projects &&
              (projects.length ? (
                <>
                  <Table
                    headers={HEADERS}
                    data={projects}
                    renderRow={renderRow}
                  />
                  <Paginator
                    numPages={numPages}
                    currentPage={page}
                    gotoPage={setPage}
                  />
                </>
              ) : (
                <Heading>No projects available </Heading>
            ))}
            
          </ProjectsBody>
        </InpageBody>
      </Inpage>
    </>
  );
}

export default Projects;
