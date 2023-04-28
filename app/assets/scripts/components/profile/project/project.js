import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';
import tArea from '@turf/area';
import { ModalWrapper } from '../../common/modal-wrapper';
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
import { useAuth } from '../../../context/auth';
import { formatDateTime, formatThousands } from '../../../utils/format';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '../../common/global-loading';
import Table, { TableRow, TableCell } from '../../common/table';
import Paginator from '../../common/paginator';
import ProjectCard from './project-card';
import copyTextToClipboard from '../../../utils/copy-text-to-clipboard';
import logger from '../../../utils/logger';
import { downloadGeotiff } from '../../../utils/map';
import BatchList from './batch-list';

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
  'Mosaic',
  'Checkpoint',
  'Classes',
  'Created',
  'Link',
  'Download',
];

// Render single AOI row
function renderRow(share, { restApiClient }) {
  const shareLink = `${window.location.origin}/share/${share.uuid}/map`;
  const { aoi, timeframe } = share;

  return (
    <TableRow key={aoi.id}>
      <TableCell>{aoi.name}</TableCell>
      <TableCell>{formatThousands(tArea(aoi.bounds) / 1e6)}</TableCell>
      <TableCell>{timeframe.mosaic}</TableCell>
      <TableCell>{timeframe.checkpoint_id}</TableCell>
      <TableCell>{timeframe.classes.length}</TableCell>
      <TableCell>{formatDateTime(timeframe.created)}</TableCell>
      <TableCell>
        <FormInputGroup>
          <FormInput readOnly value={shareLink} size='small' />
          <Button
            variation='primary-plain'
            useIcon='clipboard'
            hideText
            onClick={() => {
              copyTextToClipboard(shareLink).then((result) => {
                if (result) {
                  toasts.success('URL copied to clipboard');
                } else {
                  logger('Failed to copy', result);
                  toasts.error('Failed to copy URL to clipboard');
                }
              });
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
              const arrayBuffer = await restApiClient.get(
                `share/${share.uuid}/download/color`,
                'binary'
              );
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
  const { apiToken } = useAuth();
  const history = useHistory();
  const { projectId } = useParams();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [shares, setShares] = useState([]);
  const [isProjectLoading, setIsProjectLoading] = useState(true);
  const [isAoisLoading, setIsAoisLoading] = useState(true);
  const [project, setProject] = useState(null);

  const [deleteProject, setDeleteProject] = useState(null);

  const { restApiClient } = useAuth();

  useEffect(() => {
    async function fetchProject() {
      if (apiToken) {
        setIsProjectLoading(true);
        showGlobalLoadingMessage('Loading project...');
        try {
          const data = await restApiClient.getProject(projectId);
          setProject(data);
        } catch (err) {
          toasts.error('Project not found.');
          setIsProjectLoading(false);
          hideGlobalLoading();
          history.push('/profile/projects');
          return;
        }
        hideGlobalLoading();
        setIsProjectLoading(false);
      }
    }
    fetchProject();
  }, [apiToken]);

  useEffect(() => {
    async function fetchAOIs() {
      if (apiToken) {
        setIsAoisLoading(true);
        try {
          const sharesData = await restApiClient.get(
            `project/${projectId}/share?page=${page - 1}&limit=${AOIS_PER_PAGE}`
          );
          setTotal(sharesData.total);
          setShares(sharesData.shares);
        } catch (err) {
          toasts.error('Failed to fetch AOIs for Project');
          setIsAoisLoading(false);
        }
        setIsAoisLoading(false);
      }
    }
    if (!isProjectLoading && project) {
      fetchAOIs();
    }
  }, [apiToken, page, isProjectLoading, project]);

  if (isProjectLoading || !project) {
    return null;
  }
  return (
    <>
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <ProjectTagline>
                <StyledLink to='/profile/projects'>Projects</StyledLink>
              </ProjectTagline>
              <InpageTitleWrapper>
                <Heading data-cy='project-name'>
                  {!isProjectLoading ? project.name : ''}
                </Heading>
                <InpageToolbar>
                  <Button
                    variation='danger-plain'
                    data-cy='delete-project-button'
                    title='Delete Project'
                    useIcon='trash-bin'
                    onClick={async () => setDeleteProject(projectId)}
                  >
                    Delete Project
                  </Button>

                  <Modal
                    id='confirm-delete-project-modal'
                    data-cy='confirm-delete-project-modal'
                    revealed={deleteProject}
                    onOverlayClick={() => setDeleteProject(null)}
                    onCloseClick={() => setDeleteProject(null)}
                    title='Delete Project'
                    size='small'
                    content={
                      <ModalWrapper>
                        <div>Are you sure you want to delete this project?</div>
                        <Button
                          data-cy='cancel-project-delete'
                          variation='base-plain'
                          size='medium'
                          useIcon='xmark'
                          onClick={() => {
                            setDeleteProject(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          data-cy='confirm-project-delete'
                          variation='danger-raised-dark'
                          size='medium'
                          useIcon='tick'
                          onClick={async () => {
                            try {
                              await restApiClient.deleteProject(projectId);
                              toasts.success('Project successfully deleted.');
                              history.push(`/profile/projects`);
                            } catch (err) {
                              logger('Failed to delete project', err);
                              toasts.error('Failed to delete project.', err);
                            }
                            setDeleteProject(null);
                          }}
                        >
                          Delete Project
                        </Button>
                      </ModalWrapper>
                    }
                  />
                  <Button
                    forwardedAs={StyledLink}
                    to={`/project/${projectId}`}
                    variation='primary-raised-dark'
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
            {project ? (
              <ProjectCard
                restApiClient={restApiClient}
                project={project}
                shares={shares}
              />
            ) : null}
            <BatchList projectId={projectId} />
            {shares &&
              (shares.length ? (
                <>
                  <Heading size='small'>
                    {project ? 'Exported Maps' : 'Loading Project...'}
                  </Heading>
                  <Table
                    headers={AOI_HEADERS}
                    data={shares}
                    renderRow={renderRow}
                    extraData={{
                      project,
                      restApiClient,
                      shares,
                      setShares,
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
