import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
  InpageBodyInner,
} from '../../../styles/inpage';
import { glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { StyledNavLink } from '../../../styles/links';
import toasts from '../../common/toasts';
import { useHistory } from 'react-router';
import { useAuth, AuthContext, useRestApiClient } from '../../../context/auth';
import { formatDateTime } from '../../../utils/format';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '@devseed-ui/global-loading';
import Table, { TableRow, TableCell } from '../../common/table';
import Paginator from '../../common/paginator';

// Controls the size of each page
const PROJECTS_PER_PAGE = 20;

const HEADERS = [
  'Name',
  'Created',
  'Model',
  'Latest Checkpoint',
  'AOIs',
  'AOI Names',
];

const ProjectsBody = styled(InpageBodyInner)`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: auto 1fr;
  grid-gap: ${glsp()};
  padding-top: 0;
  justify-items: center;
`;

// Render single projects row
function renderRow(proj) {
  return (
    <TableRow key={proj.id}>
      <TableCell>
        <StyledNavLink to={`/profile/projects/${proj.id}`}>
          {proj.name}
        </StyledNavLink>
      </TableCell>
      <TableCell>{formatDateTime(proj.created)}</TableCell>
      <TableCell>{proj.model ? proj.model.name : 'No model set'}</TableCell>
      <TableCell>
        {proj.checkpoints.length
          ? proj.checkpoints[proj.checkpoints.length - 1].name
          : 'No checkpoint set'}
      </TableCell>
      <TableCell>{proj.aois.length}</TableCell>
      <TableCell>
        {proj.aois.length
          ? proj.aois.map((a) => a.name).join(', ')
          : 'No AOIs set'}
      </TableCell>
    </TableRow>
  );
}

function Projects() {
  const history = useHistory();

  const { apiToken } = useAuth();

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  const { restApiClient } = useRestApiClient();

  useEffect(async () => {
    if (apiToken) {
      showGlobalLoadingMessage('Loading projects...');
      try {
        const data = await restApiClient.getProjects(page, PROJECTS_PER_PAGE);
        setTotal(data.total);
        setProjects(data.projects);
      } catch (err) {
        toasts.error('Failed to fetch projects.');
        setIsLoading(false);
        hideGlobalLoading();
      }
      hideGlobalLoading();
      setIsLoading(false);
    }
  }, [apiToken, page]);

  const numPages = Math.ceil(total / PROJECTS_PER_PAGE);

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
                useIcon='plus'
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
                <Heading>
                  {isLoading ? 'Loading Projects...' : 'No projects found.'}
                </Heading>
              ))}
          </ProjectsBody>
        </InpageBody>
      </Inpage>
    </>
  );
}

export default Projects;
