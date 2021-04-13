import React from 'react';
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
import config from '../../config';
const { baseUrl } = config;

const HomeBody = styled(InpageBody)`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  align-items: flex-start;
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
  justify-content: flex-start;
  flex-flow: column nowrap;
  ${media.smallUp`
    flex-flow: row nowrap;
  `}

  ${Button} {
    margin-bottom: ${glsp(2)};
    ${media.smallUp`
      min-width: 14rem;
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

function Home() {
  return (
    <App pageTitle='LandingHome'>
      <PageHeader />
      <HomeBody role='main'>
        <HomeIntro>
          <InpageHeader>
            <InpageHeadline>
              <HomeTagline>Microsoft Planetary Computer</HomeTagline>
              <HomeHeading size='large'>PEARL Land Cover Mapping</HomeHeading>
            </InpageHeadline>
          </InpageHeader>
          <Lead>
            The Planetary Computer Land Cover Mapping platform uses state of the
            art ML and AI technologies to drastically reduce the time required
            to produce an accurate land cover map. Scientists and mappers get
            access to pre-trained, high performing starter models, and high
            resolution imagery (e.g. NAIP) hosted on Microsoft Azure.
          </Lead>
          <HomeCTA>
            <Heading size='small' variation='baseLight'>
              COMING SOON
            </Heading>
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
              <strong>Cloud based</strong>, open-sourced services provide access
              to high quality models, imagery and processing.
            </li>
          </ul>
        </HomeTout>
      </HomeBody>
    </App>
  );
}

export default Home;
