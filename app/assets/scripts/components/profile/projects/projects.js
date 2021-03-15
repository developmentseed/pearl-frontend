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
  InpageBodyInner,
} from '../../../styles/inpage';
import { Form, FormInput } from '@devseed-ui/form';
import { glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { StyledNavLink } from '../../../styles/links';
import toasts from '../../common/toasts';
import { useHistory } from 'react-router';
const ProjectsBody = styled(InpageBodyInner)`
  display: grid;
  grid-template-columns: 1fr 4fr;
  padding: 0 ${glsp(4)};
  min-height: 100%;
`;
const CardResults = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 1rem;
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
const NavList = styled.ol``;

function Projects(props) {
  const history = useHistory();
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
                            <Form>
                              <FormInputGroup>
                                <FormInput
                                  id={`${proj.id}-site_url`}
                                  name='site-url'
                                  className='form__control'
                                  type='text'
                                  readOnly
                                  // value={val}
                                  value='url://map.link.here'
                                />
                                <Button
                                  variation='base-raised-semidark'
                                  useIcon='clipboard'
                                  size='small'
                                  hideText
                                  onClick={() => {
                                    try {
                                      document
                                        .getElementById(`${proj.id}-site_url`)
                                        .select();
                                      document.execCommand('copy');
                                      window.getSelection().removeAllRanges();
                                      toasts.success('File path copied!', {
                                        autoClose: 3000,
                                      });
                                    } catch (err) {
                                      toasts.error('Copy to clipboard failed', {
                                        autoClose: 3000,
                                      });
                                    }
                                  }}
                                >
                                  <span>Copy to clipboard</span>
                                </Button>
                              </FormInputGroup>
                            </Form>
                            <Button
                              variation='primary-plain'
                              useIcon={['download', 'after']}
                              size='small'
                            >
                              Download
                            </Button>
                          </CardResults>
                        ),
                      }}
                      size='large'
                      onClick={() => {
                        history.push(`/project/${proj.id}`);
                      }}
                    />
                  )}
                />
              ) : (
                <Heading>No projects available </Heading>
              ))}
          </ProjectsBody>
        </InpageBody>
      </Inpage>
    </>
  );
}

Projects.propTypes = {
  projectsList: T.object,
};
export default Projects;
