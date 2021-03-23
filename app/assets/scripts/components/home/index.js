import React, { useContext } from 'react';
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
import GlobalContext from '../../context/global';
import config from '../../config';
const { baseUrl } = config;

const HomeBody = styled(InpageBody)`
  display: flex;
  height: 100%;
  align-items: center;
  color: ${themeVal('color.surface')};

  background-image: url('${baseUrl}/assets/graphics/content/home-bg--largeUp.jpg'),
    linear-gradient(225deg, #040a15, #070f1c);
  background-repeat: no-repeat, no-repeat;
  background-size: cover, cover;
  background-position: 25vw 0vw, center;
  ${media.xlargeUp`
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
  font-size: clamp(2rem, -0.875rem + 8.333vw, 3.75rem);
  line-height: 4rem;
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
  opacity: 0.64;
  margin: ${glsp(1.5)} ${glsp()};
  > * {
    margin-right: ${glsp()};
  }
`;

function renderRestApiHealth(restApiHealth) {
  const { isReady, hasError, getData } = restApiHealth;
  if (!isReady()) return 'Fetching...';
  if (hasError()) return 'Unavailable.';
  return getData().message || 'Ok';
}

function Home() {
  const { restApiHealth } = useContext(GlobalContext);

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
              title='Visit About page'
            >
              Read More
            </Button>
            <Button
              useIcon={['chevron-right', 'after']}
              size='xlarge'
              variation='primary-raised-dark'
              to='/project/new'
              title='Start a new project'
            >
              Launch App
            </Button>
          </HomeCTA>
        </HomeIntro>
        <StatusSection>
          <strong>Status </strong>
          <p>API: {renderRestApiHealth(restApiHealth)}</p>
        </StatusSection>
      </HomeBody>
    </App>
  );
}

export default Home;
