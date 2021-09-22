import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import App from '../common/app';

import PageHeader from '../common/page-header';
import {
  InpageBody,
  InpageBodyInner,
  InpageHeader,
  InpageHeadline,
  InpageTagline,
} from '../../styles/inpage';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import { themeVal, media, glsp } from '@devseed-ui/theme-provider';
import { StyledLink } from '../../styles/links';

import { fetchJSON } from '../../utils/utils';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '../../context/auth';

import config from '../../config';
const { environment, baseUrl, restApiEndpoint } = config;

const HomeBody = styled(InpageBody)`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  align-items: flex-start;
  color: #ffffff;

  background-image: linear-gradient(to top right, #040a15, rgba(4, 10, 21, 0)),
    url('${baseUrl}/assets/graphics/content/home-bg--largeUp.jpg'),
    linear-gradient(225deg, #040a15, #070f1c);
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-size: cover, cover, cover;
  background-position: center, 25vw 0vw, center;
  ${media.xlargeUp`
    background-image: 
    url('${baseUrl}/assets/graphics/content/home-bg--largeUp.jpg'),
    linear-gradient(225deg, #040a15, #070f1c);
    background-size: contain, cover;
    background-position: calc(100% + 20vw) 0, center;
  `}
`;

const HomeIntro = styled(InpageBodyInner)`
  max-width: 50rem;
  margin: 0;
  margin-top: 12vw;
  ${media.xlargeUp`
    margin: 12vw 12vw 0;
  `};
`;

const Lead = styled.p`
  line-height: 1.75;
  font-size: 1.125rem;
  margin: ${glsp(2)} 0 ${glsp(4)};
`;

const HomeTagline = styled(InpageTagline)`
  margin-bottom: ${glsp(0.5)};
  font-size: clamp(1rem, -0.875rem + 4.333vw, 1.25rem);
  letter-spacing: 1.75px;
  color: inherit;
  opacity: 0.8;
`;

const HomeHeading = styled(Heading)`
  font-weight: ${themeVal('type.base.weight')};
  font-size: clamp(2rem, -0.875rem + 8.333vw, 3.5rem);
  line-height: 1.25;
  margin: 0;
`;

const HomeCTA = styled.article`
  display: flex;
  justify-content: flex-end;
  flex-flow: column nowrap;
  ${media.smallUp`
    flex-flow: row nowrap;
  `}

  ${Button} {
    margin-bottom: ${glsp(2)};
    ${media.smallUp`
      min-width: 14rem;
      margin-left: ${glsp(2)};
    `}
  }
`;

const HomeTout = styled(InpageBodyInner)`
  flex-basis: 100%;
  margin: ${glsp(2)} 0;
  ${media.xlargeUp`
    margin: 0 12vw;
  `};
  ul {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: ${glsp(2)};
    ${media.largeUp`
      grid-template-columns: repeat(3, 1fr);
    `};
  }
  li {
    padding: ${glsp(2)};
    border-left: 4px solid ${themeVal('color.primary')};
  }
`;

const StatusSection = styled.section`
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin: ${glsp(1.5)} ${glsp()};
  > * {
    margin-right: ${glsp()};
  }
`;

function Home() {
  const [apiHealth, setApiHealth] = useState('Loading...');
  const { loginWithRedirect } = useAuth0();
  const { isAuthenticated } = useAuth();

  // Fetch API health message on mount
  useEffect(() => {
    // Do not fetch on production
    if (environment === 'production') return;

    fetchJSON(`${restApiEndpoint}/health`)
      .then(({ body }) => {
        setApiHealth(body.message || 'Ok.');
      })
      .catch(() => {
        setApiHealth('Unavailable.');
      });
  }, []);

  return (
    <App pageTitle='Home'>
      <PageHeader />
      <HomeBody role='main'>
        <HomeIntro>
          <InpageHeader>
            <InpageHeadline>
              <HomeTagline>Microsoft Planetary Computer</HomeTagline>
              <HomeHeading size='large'>PEARL: Land Cover Mapping</HomeHeading>
            </InpageHeadline>
          </InpageHeader>
          <Lead>
            The Planetary Computer Land Cover Mapping platform uses state of the
            art ML and AI technologies to drastically reduce the time required
            to produce an accurate land cover map. Scientists and mappers get
            access to pre-trained, high performing starter models, and high
            resolution imagery like NAIP hosted on Microsoft Azure.
          </Lead>
          <HomeCTA>
            <Button
              size='xlarge'
              variation='achromic-glass'
              to='/about'
              as={StyledLink}
              title='Visit About page'
            >
              Read More
            </Button>
            {!isAuthenticated ? (
              <Button
                useIcon={['chevron-right', 'after']}
                size='xlarge'
                variation='primary-raised-dark'
                className='button-class'
                title='Log in to launch app'
                onClick={() => loginWithRedirect()}
              >
                Sign Up to Start Mapping
              </Button>
            ) : (
              <Button
                useIcon={['chevron-right', 'after']}
                size='xlarge'
                variation='primary-raised-dark'
                to='/project/new'
                as={StyledLink}
                title='Start a new project'
              >
                Launch App
              </Button>
            )}
          </HomeCTA>
        </HomeIntro>
        <HomeTout>
          <ul>
            <li>
              <strong>Faster</strong> creation of land cover maps
            </li>
            <li>
              <strong>Easier</strong> QA and editing of the LULC map. Save,
              store, pause and return to mapping anytime.
            </li>
            <li>
              <strong>Scalable</strong>, cloud-based open source services
              provide access to high quality models, imagery and processing.
            </li>
          </ul>
        </HomeTout>
        {environment !== 'production' && (
          <StatusSection>
            <strong>Status </strong>
            <p>API: {apiHealth}</p>
          </StatusSection>
        )}
      </HomeBody>
    </App>
  );
}

export default Home;
