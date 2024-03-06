import React from 'react';
import styled from 'styled-components';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';
import {
  InpageBody,
  InpageBodyInner,
  InpageHeader,
  InpageHeaderInner,
  InpageTitle,
  InpageHeadline,
} from '../../styles/inpage';
import Prose from '../../styles/type/prose';
import { Heading } from '@devseed-ui/typography';
import { glsp, media } from '@devseed-ui/theme-provider';

import App from '../common/app';
import { PartnerLogos } from '../home';
import { Subheading } from '../../styles/type/heading';

const AboutBody = styled(InpageBody)`
  ${Prose} {
    max-width: 48rem;
  }
  img {
    max-width: 100%;
  }
`;

const AboutBodyInner = styled(InpageBodyInner)`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto;
  grid-gap: 1rem;
  ${media.mediumUp`
    grid-template-columns: 4fr 1fr;
    grid-template-rows: auto;
  `}
`;

const InpageNav = styled.nav`
  order: -1;
  ${media.mediumUp`
    order: 1;
    position: sticky;
    top: 0;
    height: 100vh;
    padding-top: ${glsp(8)};
    margin: ${glsp(-8)} 0;
  `}
  li {
    line-height: 2;
  }
`;

class About extends React.Component {
  render() {
    return (
      <App pageTitle='About'>
        <PageHeader />
        <PageBody role='main'>
          <AboutBody>
            <InpageHeader>
              <InpageHeaderInner>
                <InpageHeadline>
                  <Subheading>About &amp; User Guide</Subheading>
                  <InpageTitle>
                    PEARL Planetary Computer Land Cover Mapping
                  </InpageTitle>
                </InpageHeadline>
              </InpageHeaderInner>
            </InpageHeader>
            <AboutBodyInner>
              <Prose>
                <Heading size='large' as='h2' id='introduction'>
                  Introduction
                </Heading>
                <p>
                  PEARL is the Microsoft Planetary Computer Land Cover Mapping
                  platform. It combines state of the art machine learning
                  technology, open data sets, and scalable computing from
                  Microsoft Azure to improve LULC mapping workflows. PEARL is
                  intended for scientists and mappers who are engaged in complex
                  workflows and several tools to prepare reliable land use and
                  land classification maps. PEARL improves on existing tools
                  through a human-in-the-loop approach — scientists and mappers
                  use starter machine learning models and improve that with a
                  few clicks for their area and classes of interest.
                </p>
                <Heading size='medium' as='h3'>
                  Coverage and Datasets
                </Heading>
                <p>
                  This version 2 of PEARL enables mapping land use and land
                  cover in the United States and globally. The platform users
                  imagery from the{' '}
                  <a href='https://planetarycomputer.microsoft.com/dataset/naip'>
                    National Agricultural Imagery Program
                  </a>{' '}
                  (NAIP) in the United States, and the{' '}
                  <a href='https://planetarycomputer.microsoft.com/dataset/sentinel-2-l2a'>
                    Sentinel 2 L-2A
                  </a>{' '}
                  program for global imaging. NAIP is available as open data and
                  on Microsoft Azure as part of the Planetary Computer program.
                  Starting 2003, NAIP was captured during 2003, 2008, 2009, 2010
                  and 2015. Sentinel 2 L-2A imagery is available from Planetary
                  Computer starting in 2015.
                </p>
                <Heading size='medium' as='h3'>
                  Machine Learning Models
                </Heading>
                <p>
                  PEARL has 3 base machine learning models for land use and land
                  cover pixel predictions. Two of these models have been trained
                  primarily with data from the east coast of the United States,
                  but they should be a good starting point for LULC mapping
                  throughout the US. The main difference between these models is
                  the number of base classes. The platform can map up to 9 LULC
                  classes using the 9 class model. These classes are Water,
                  Emergent Wetlands, Tree Canopy, Shrubland, Low Vegetation,
                  Barren, Structure, Impervious Surface, and Impervious Roads.
                  The base training data for each of the models comes from the
                  Chesapeake Conservancy.{' '}
                  <a href='https://chesapeakeconservancy.org/wp-content/uploads/2020/03/LC_Class_Descriptions.pdf'>
                    Detailed class descriptions are available here.
                  </a>{' '}
                  For global imagery, a 9-class base model is available trained
                  on Mexico data from Reforestamos.
                </p>
                <Heading size='large' as='h2' id='guide-home'>
                  Getting around PEARL
                </Heading>
                <img src='../assets/graphics/content/guide-home.png' />
                <p>
                  The PEARL application has four main pages: the tool itself, a
                  user’s saved projects list, individual project pages, and the
                  Public Maps page. From the home page, navigate to the
                  application by clicking “Launch App.” Once logged in, you can
                  view your existing projects from the “Account” dropdown. View
                  project information by navigating to the individual project
                  page from the table of your projects. Past projects can be
                  opened for retraining and further refinement via the
                  individual project page. The Public Maps page allows you to
                  view any published prediction map, which can also be useful
                  for comparing LULC maps.
                </p>
                <Heading size='medium' as='h3'>
                  Creating Projects and AOIs
                </Heading>
                <p>
                  Users can create and refine AI-assisted land cover maps from
                  the main application page.
                </p>
                <Heading size='medium' as='h3' id='guide-aoi'>
                  Selecting an Area of Interest
                </Heading>
                <img src='../assets/graphics/content/guide-aoi.png' />
                <p>
                  First, select an area of interest (AOI) by clicking the pencil
                  icon in the <strong>Selected Area</strong> section to draw a
                  bounding box on the map. Navigate directly to your area of
                  concern using the magnifying glass icon on the map to search
                  for a specific address or region. Areas of interest are
                  currently limited to a maximum size for live predictions. The
                  AOI selection box displays the area size as you draw and will
                  indicate if the area exceeds the maximum size allowed for live
                  predictions. When an area exceeds the maximum live prediction
                  size, the processing will be queued and run as a batch
                  prediction.
                </p>
                <Heading size='medium' as='h3' id='guide-imagery'>
                  Selecting an Imagery Source
                </Heading>
                <img src='../assets/graphics/content/guide-imagery.png' />
                <p>
                  PEARL permits selection of imagery sources for the LULC
                  prediction. NAIP and Sentinel 2 L-2A are both available for
                  generating prediction tiles.
                </p>
                <Heading size='medium' as='h3' id='guide-mosaic'>
                  Selecting a Mosaic
                </Heading>
                <img src='../assets/graphics/content/guide-mosaic.png' />
                <p>
                  For imagery source of Sentinel, select a timeframe. Timeframe
                  selection permits the prediction of land use and land cover at
                  any mosaic - a compound image created by stitching together
                  the most recent, cloud-free images in the selected date range.
                  Timeframes can be selected from a minimum of 2 days to include
                  any duration of seasons and months. Preselected timeframes
                  allow for quarterly mosaic use.
                </p>
                <Heading size='medium' as='h3' id='guide-models'>
                  Selecting a Starter Model
                </Heading>
                <img src='../assets/graphics/content/guide-models.png' />
                <p>
                  The starter model selection screen displays information about
                  starter model seed data, class distribution and F1 scores,
                  training area, and label sources.
                </p>
                <Heading size='large' as='h2' id='guide-run'>
                  Running inference and improving the model through retraining
                </Heading>
                <img src='../assets/graphics/content/guide-predictions.png' />
                <p>
                  Once the AOI is defined and the model selected, run inference
                  over your area by clicking on the <strong>Run Model</strong>{' '}
                  button. The session status bar will indicate the progress of
                  your predictions. Once predictions are ready, they will load
                  in over the AOI as image tiles. The classes available from the
                  model are visible in the side left panel, along with the
                  Retrain, Refine, and Layer tools.
                </p>
                <Heading size='medium' as='h3' id='guide-retrain'>
                  Retraining
                </Heading>
                <img src='../assets/graphics/content/guide-retrain.png' />
                <p>
                  After receiving the initial model inference, retraining allows
                  users to modify the starter model to obtain more accurate
                  predictions for the selected AOI. The <strong>Draw</strong>{' '}
                  tool allow users to select available classes and mark samples
                  for sending to the model. Draw allows free-hand creation of
                  polygons via mouse clicking and dragging. When a user draws a
                  polygon during retraining 100 points are randomly sampled from
                  that polygon and used for retraining.
                </p>
                <p>
                  The <strong>Erase</strong> tool allows erasure from polygons
                  while clicking and dragging.
                </p>
                <p>
                  Each starter model within the tool comes with a “seed” dataset
                  that is used during retraining. The seed dataset helps with
                  retraining because it doesn’t require users to submit examples
                  of every class during each retraining iteration. The seed data
                  set helps facilitate sharing weights between the starter model
                  and the retraining model so the last layer of the starter
                  model can be fine tuned. This dataset has class distribution
                  as the original training data set.
                </p>
                <Heading size='medium' as='h3' id='guide-analysis'>
                  Prediction Analysis
                </Heading>
                <img src='../assets/graphics/content/guide-analysis.png' />
                <p>
                  After submitting retraining samples, the analysis panel will
                  populate with metrics on class distribution and class f1
                  scores. This is possible because a subset of the retraining
                  samples are held out (ie unseen during retraining), so the
                  retrained model can be evaluated against those samples. Use
                  the analysis to compare your expected understanding of an
                  area’s land cover classes with the returned results. Per class
                  F1 scores help you understand how each class of the model is
                  performing.
                </p>
                <p>
                  The F1 score is the harmonic mean of precision, and recall.
                  Precision is the percentage of “guesses” that a model makes
                  that are correct. Recall is the percentage of true positives
                  that a model captures. At a pixel level we’re comparing if the
                  predicted land cover class matches the ground truth land cover
                  class. The global F1 score in the model meta-data card is
                  “weighted” F1 score, so classes that occur more often will
                  have a greater weight in that value, interpreting this global
                  score within the context of the F1 score performance for each
                  individual class will give a more complete picture of model
                  performance.
                </p>
                <Heading size='large' as='h2' id='guide-checkpoint'>
                  Saving your work using checkpoints
                </Heading>
                <img src='../assets/graphics/content/guide-checkpoint.png' />
                <p>
                  After retraining, save the current state of your model via a
                  checkpoint. Click <strong>Save Checkpoint</strong> to provide
                  a unique name for your current checkpoint. Checkpoints are a
                  point in the history of the model which you would like to save
                  and reuse later. Internally, checkpoints store the unique set
                  of model weights based on the retraining steps taken.
                </p>
                <Heading size='large' as='h2' id='guide-export'>
                  Exporting & Sharing Maps
                </Heading>
                <img src='../assets/graphics/content/guide-export.png' />
                <p>
                  There are two ways to share your LULC maps — downloading a
                  GeoTIFF or an interactive map URL that can be embedded. Once
                  an inference is generated and you are satisfied with the
                  output, click on the <strong>Export</strong> button on the top
                  right corner. A “Share URL” must be created first before maps
                  can be downloaded and shared.
                </p>
                <Heading size='large' as='h2' id='guide-compare'>
                  Compare Maps
                </Heading>
                <img src='../assets/graphics/content/guide-compare.png' />
                <p>
                  The compare tool allows the direct comparison of two exported
                  prediction maps. To compare maps, first generate predictions
                  from your desired AOI. Once ready to compare, you can then
                  follow the below steps
                  <ol>
                    <li>
                      Export via the header “export” dropdown option “Create
                      Share Link”
                    </li>
                    <li>
                      Once exports for your two desired maps are generated,
                      navigate to the respective project page
                    </li>
                    <li>
                      In the exported maps table toggle the “publish” switch
                    </li>
                    <li>Navigate to the “Public Maps” page</li>
                    <li>
                      Find and select the two desired AOIs from the public maps
                      list
                    </li>
                    <li>
                      Click “Compare” to navigate to the corresponding map
                      comparison
                    </li>
                  </ol>
                </p>
                <Heading size='large' as='h2' id='guide-limitations'>
                  Limitations
                </Heading>
                <ul>
                  <li>
                    It is possible to run inference over all of the US, however
                    the starter models were only trained in the north eastern
                    United States with data from West Virginia, Maryland,
                    Pennsylvania, New York, Delaware, and Virginia due to
                    labeled data constraints. There might be a drop in inference
                    performance in terms of F-scores when compared to the
                    starter model test data set performance metrics is expected
                    for areas outside of where the starter model training data
                    came from. We are aiming to release additional starter
                    models that cover more geographically diverse regions.
                  </li>
                  <li>
                    While adding a new class is possible, deleting a class from
                    the model is not supported at the moment.
                  </li>
                </ul>
                <PartnerLogos>
                  <Heading useAlt as='p'>
                    In Partnership With
                  </Heading>
                  <li>
                    <img src='../assets/graphics/content/logo_devseed.svg' />
                  </li>
                </PartnerLogos>
              </Prose>
              <InpageNav>
                <ul>
                  <li>
                    <strong>User Guide</strong>
                  </li>
                  <li>
                    <a href='#introduction'>Introduction</a>
                  </li>
                  <li>
                    <a href='#guide-home'>Getting around PEARL</a>
                  </li>
                  <li>
                    <a href='#guide-aoi'>Selecting an AOI</a>
                  </li>
                  <li>
                    <a href='#guide-imagery'>Selecting Imagery</a>
                  </li>
                  <li>
                    <a href='#guide-mosaic'>Selecting Mosaics</a>
                  </li>
                  <li>
                    <a href='#guide-models'>Selecting Starter Models</a>
                  </li>
                  <li>
                    <a href='#guide-run'>Running inference</a>
                  </li>
                  <li>
                    <a href='#guide-retrain'>Retraining</a>
                  </li>
                  <li>
                    <a href='#guide-analysis'>Prediction Analysis</a>
                  </li>
                  <li>
                    <a href='#guide-checkpoint'>Saving Checkpoints</a>
                  </li>
                  <li>
                    <a href='#guide-export'>Exporting & Sharing maps</a>
                  </li>
                  <li>
                    <a href='#guide-compare'>Comparing maps</a>
                  </li>
                  <li>
                    <a href='#guide-limitations'>Limitations</a>
                  </li>
                </ul>
              </InpageNav>
            </AboutBodyInner>
          </AboutBody>
        </PageBody>
      </App>
    );
  }
}

export default About;
