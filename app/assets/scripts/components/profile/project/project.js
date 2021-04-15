import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import tArea from '@turf/area';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
  InpageBodyInner,
} from '../../../styles/inpage';
import { glsp, media } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { StyledNavLink } from '../../../styles/links';
import toasts from '../../common/toasts';
import { AuthContext, useRestApiClient } from '../../../context/auth';
import { formatDateTime, formatThousands } from '../../../utils/format';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '@devseed-ui/global-loading';
import Table, { TableRow, TableCell } from '../../common/table';
import Paginator from '../../common/paginator';
import ProjectCard from './project-card';
import { areaFromBounds } from '../../../utils/map';

// Controls the size of each page
const AOIS_PER_PAGE = 20;


const ProjectBody = styled(InpageBodyInner)`
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

const AOI_HEADERS = [
  'AOI Name',
  'AOI Size (Km2)',
  'Checkpoint',
  'Classes',
  'Created',
  'Link',
  'Download'
];

// Render single projects row
function renderRow(aoi) {
  console.log('row', aoi);
  return (
    <TableRow key={aoi.id}>
      <TableCell>
        {aoi.name}
      </TableCell>
      <TableCell>{ formatThousands(tArea(aoi.bounds) / 1e6 )}</TableCell>
      <TableCell>{ aoi.checkpoint_name }</TableCell>
      <TableCell>
        Number of Classes
      </TableCell>
      <TableCell>{ formatDateTime(aoi.created) }</TableCell>
      <TableCell>
        Link
      </TableCell>
      <TableCell>
        Download
      </TableCell>
    </TableRow>
  );
}

function Project() {

  const { apiToken } = useContext(AuthContext);
  const { projectId } = useParams();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [aois, setAois] = useState([]);
  const [isProjectLoading, setIsProjectLoading] = useState(true);
  const [isAoisLoading, setIsAoisLoading] = useState(true);
  const [project, setProject] = useState(null);

  const { restApiClient } = useRestApiClient();

  useEffect(async () => {
    if (apiToken) {
      setIsProjectLoading(true);
      showGlobalLoadingMessage('Loading project...');
      try {
        const data = await restApiClient.getProject(projectId);
        console.log('project', data);
        setProject(data);
      } catch (err) {
        toasts.error('Failed to fetch project.');
        setIsProjectLoading(false);
        hideGlobalLoading();
      }
      hideGlobalLoading();
      setIsProjectLoading(false);
    }
  }, [apiToken]);

  useEffect(async () => {
    if (apiToken) {
      setIsAoisLoading(true);
      try {
        const aoisData = await restApiClient.getBookmarkedAOIs(projectId);
        console.log('aois', aoisData);
        setTotal(aoisData.total);
        setAois(aoisData.aois);
      } catch (err) {
        toasts.error('Failed to fetch AOIs for Project');
        setIsAoisLoading(false);
      }
      setIsAoisLoading(false);
    }
  }, [apiToken, page]);

  const numPages = Math.ceil(total / AOIS_PER_PAGE);

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
              <InpageTitle>{ project ? project.name : '' }</InpageTitle>
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
          <ProjectBody>
            { project ? (
              <ProjectCard project={project} aois={aois} />
            ) : null }
            {aois &&
              (aois.length ? (
                <>
                  <Heading>
                    {project ? project.name : 'Loading Project...'}
                  </Heading>
                  <Table
                    headers={AOI_HEADERS}
                    data={aois}
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
                  {isAoisLoading ? 'Loading AOIs...' : 'No Exported AOIs for this project.'}
                </Heading>
              ))}
          </ProjectBody>
        </InpageBody>
      </Inpage>
    </>
  );
}

export default Project;
