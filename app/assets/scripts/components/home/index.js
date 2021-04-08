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
import config from '../../config';
import { fetchJSON } from '../../context/reducers/reduxeed';
const { environment, baseUrl, restApiEndpoint } = config;

const HomeBody = styled(InpageBody)`
  display: flex;
  height: 100%;
  align-items: center;
  color: ${themeVal('color.surface')};

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
  ${media.xlargeUp`
    margin: 0 12vw;
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

  // Fetch API health message on mount
  useEffect(() => {
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
              <HomeHeading size='jumbo'>Azure Land Cover Mapping</HomeHeading>
            </InpageHeadline>
          </InpageHeader>
          <Lead>
            The Azure Land Cover Mapping plaform uses state of the art ML and AI
            technologies to drastically reduce the time required to produce an
            accurate land cover map. Scientists and mappers get access to
            pre-trained, high performing starter models, and high resolution
            imagery (e.g. NAIP) hosted on Microsoft Azure.
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
          </HomeCTA>
        </HomeIntro>
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
