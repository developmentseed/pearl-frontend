import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import tArea from '@turf/area';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageBody,
  InpageTagline,
  InpageTitleWrapper,
  InpageToolbar,
} from '../../../styles/inpage';
import { ProjectsBody as ProjectBody } from '../projects/projects';
import { media } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { FormInput } from '@devseed-ui/form';
import { StyledLink } from '../../../styles/links';
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
import copyTextToClipboard from '../../../utils/copy-text-to-clipboard';
import logger from '../../../utils/logger';
import { downloadGeotiff } from '../../../utils/map';

// Controls the size of each page
const AOIS_PER_PAGE = 20;

const ProjectTagline = styled(InpageTagline)`
  color: initial;
  opacity: 1;
`;

const FormInputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 2.125rem;
  input {
    display: none;
    ${media.mediumUp`
      display: revert;
    `};
  }
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

const AOI_HEADERS = [
  'AOI Name',
  'AOI Size (Km2)',
  'Checkpoint',
  'Classes',
  'Created',
  'Link',
  'Download',
];

// Render single projects row
function renderRow(aoi, { project, restApiClient }) {
  console.log('row', aoi);
  const aoiLink = `${window.location.origin}/aoi/${aoi.uuid}/map`;
  return (
    <TableRow key={aoi.id}>
      <TableCell>{aoi.name}</TableCell>
      <TableCell>{formatThousands(tArea(aoi.bounds) / 1e6)}</TableCell>
      <TableCell>{aoi.checkpoint_name}</TableCell>
      <TableCell>{aoi.classes.length}</TableCell>
      <TableCell>{formatDateTime(aoi.created)}</TableCell>
      <TableCell>
        <FormInputGroup>
          <FormInput readOnly value={aoiLink} size='small' />
          <Button
            variation='primary-plain'
            useIcon='clipboard'
            hideText
            onClick={() => {
              try {
                copyTextToClipboard(aoiLink);
                toasts.success('Coped URL to Clipboard');
              } catch (err) {
                logger('Failed to copy', err);
                toasts.error('Failed to copy to clipboard');
              }
            }}
          />
        </FormInputGroup>
      </TableCell>
      <TableCell>
        <Button
          variation='primary-plain'
          useIcon='download'
          hideText
          onClick={async () => {
            try {
              showGlobalLoadingMessage('Preparing GeoTIFF...');
              const arrayBuffer = await restApiClient.downloadGeotiff(project.id, aoi.id);
              const filename = `${aoi.id}.tiff`;
              downloadGeotiff(arrayBuffer, filename);
            } catch (err) {
              logger('Failed to download geotiff', err);
              toasts.error('Failed to download GeoTIFF');
              hideGlobalLoading();
            }
            hideGlobalLoading();
          }}
        />
      </TableCell>
    </TableRow>
  );
}

function Project() {
  const { apiToken } = useContext(AuthContext);
  const history = useHistory();
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
        const aoisData = await restApiClient.getBookmarkedAOIs(projectId, page, AOIS_PER_PAGE);
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
  console.log(project);
  return (
    <>
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <ProjectTagline>
                <StyledLink to='/profile/projects'>Projects</StyledLink> /{' '}
                {project ? project.name : ''}
              </ProjectTagline>
              <InpageTitleWrapper>
                <Heading>{project ? project.name : ''}</Heading>
                <InpageToolbar>
                  {/* ToDO: Wire Up Delete Button */}
                  <Button
                    variation='base-plain'
                    title='Delete Project'
                    useIcon='trash-bin'
                    onClick={async () => {
                      try {
                        await restApiClient.deleteProject(projectId);
                        toasts.success('Project successfully deleted.');
                        history.push(`/profile/projects`);
                      } catch (err) {
                        logger('Failed to delete project', err);
                        toasts.error('Failed to delete project.', err);
                      }
                    }}
                  >
                    Delete Project
                  </Button>
                  <Button
                    forwardedAs={StyledLink}
                    to={`/project/${project && project.id}`}
                    variation='primary-raised-light'
                    title='Edit project'
                    useIcon={['chevron-right--small', 'after']}
                  >
                    Open in Editor
                  </Button>
                </InpageToolbar>
              </InpageTitleWrapper>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <ProjectBody>
            {project ? <ProjectCard restApiClient={restApiClient} project={project} aois={aois} /> : null}
            {aois &&
              (aois.length ? (
                <>
                  <Heading size='small'>
                    {project ? 'Exported Maps' : 'Loading Project...'}
                  </Heading>
                  <Table
                    headers={AOI_HEADERS}
                    data={aois}
                    renderRow={renderRow}
                    extraData={{
                      project,
                      restApiClient,
                    }}
                  />
                  <Paginator
                    currentPage={page}
                    gotoPage={setPage}
                    totalItems={total}
                    itemsPerPage={AOIS_PER_PAGE}
                  />
                </>
              ) : (
                <Heading>
                  {isAoisLoading
                    ? 'Loading AOIs...'
                    : 'No Exported AOIs for this project.'}
                </Heading>
              ))}
          </ProjectBody>
        </InpageBody>
      </Inpage>
    </>
  );
}

export default Project;
