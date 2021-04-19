import React, { useEffect, useState } from 'react';
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
import { useAuth } from '../../../context/auth';
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

export const ProjectsBody = styled(InpageBodyInner)`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: auto 1fr;
  grid-gap: ${glsp()};
  padding-top: 0;
`;

export const ProjectsHeadline = styled(InpageHeadline)`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr;
  width: 100%;
  justify-content: space-between;
  align-items: center;
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
  const { apiToken } = useAuth();

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  const { restApiClient } = useAuth();

  useEffect(() => {
    async function fetchProjects() {
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
    }
    fetchProjects();
  }, [apiToken, page]);

  return (
    <>
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <ProjectsHeadline>
              <InpageTitle>Projects</InpageTitle>
              <Button
                forwardedAs={StyledNavLink}
                to='/project/new'
                variation='primary-raised-light'
                size='large'
                useIcon='plus'
                title='Start a new project'
              >
                New Project
              </Button>
            </ProjectsHeadline>
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
                    hoverable
                  />
                  <Paginator
                    currentPage={page}
                    gotoPage={setPage}
                    totalItems={total}
                    itemsPerPage={PROJECTS_PER_PAGE}
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
