import React from 'react';
import styled from 'styled-components';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';
import {
  InpageBody,
  InpageBodyInner,
  InpageHeader,
  InpageHeaderInner,
} from '../../styles/inpage';
import Prose from '../../styles/type/prose';
import { Heading } from '@devseed-ui/typography';

import App from '../common/app';

const AboutBody = styled(InpageBody)`
  ${Prose} {
    max-width: 48rem;
  }
  img {
    max-width: 100%;
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
                <Heading size='xlarge'>
                  PEARL Planetary Computer Land Cover Mapping
                </Heading>
              </InpageHeaderInner>
            </InpageHeader>
            <InpageBodyInner>
              <Prose>
                <Heading size='large' as='h2'>
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
                <img src='../assets/graphics/content/guide-naip.png' />
                <p>
                  V1.0.0 of PEARL supports LULC mapping in the United States.
                  The platform users imagery from the National Agricultural
                  Imagery Program (NAIP). NAIP is available as open data and on
                  Microsoft Azure as part of the Planetary Computer program.
                  Starting 2003, NAIP was captured during 2003, 2008, 2009, 2010
                  and 2015.
                </p>
                <Heading size='medium' as='h3'>
                  Machine Learning Models
                </Heading>
                <p>
                  This version of PEARL has 2 starter models. While these models
                  have been trained primarily with data from the east coast of
                  the United States, they should be a good starting point for
                  LULC mapping throughout the country. The main difference
                  between these models is the number of base classes. The
                  platform can map upto 9 LULC classes using the 9 class model.
                  These classes are Water, Emergent Wetlands, Tree Canopy,
                  Shrubland, Low Vegetation, Barren, Structure, Impervious
                  Surface, and Impervious Roads. The base training data for each
                  of the models comes from the Chesapeake Conservancy.{' '}
                  <a href='https://chesapeakeconservancy.org/wp-content/uploads/2020/03/LC_Class_Descriptions.pdf'>
                    Detailed class descriptions are available here.
                  </a>
                </p>
                <Heading size='large' as='h2'>
                  Getting around PEARL
                </Heading>
                <img src='../assets/graphics/content/guide-home.png' />
                <p>
                  The PEARL application has four main pages: the tool itself, a
                  user’s saved projects list, individual project pages, and the
                  home page. From the home page, navigate to the application by
                  clicking “Launch App.” Once logged in, you can view your
                  existing projects from the “Account” dropdown. View project
                  information by navigating to the individual project page from
                  the table of your projects. Past projects can be opened for
                  retraining and further refinement via the individual project
                  page.
                </p>
                <Heading size='medium' as='h3'>
                  Creating Projects and AOIs
                </Heading>
                <p>
                  Users can create and refine AI-assisted land cover maps from
                  the main application page.
                </p>
                <Heading size='medium' as='h3'>
                  Selecting an Area of Interest
                </Heading>
                <img src='../assets/graphics/content/guide-aoi.png' />
                <p>
                  First, select an area of interest (AOI) by clicking the pencil
                  icon in the “Selected Area” section to draw a bounding box on
                  the map. Navigate to your area of concern via the magnifying
                  glass icon on the map to search for a specific address or
                  region. Areas of interest are currently limited to a maximum
                  size of 100km2 - the AOI selection box displays the area size
                  as you draw, and the bounding box will turn red to indicate
                  regions which are too large.
                </p>
                <Heading size='medium' as='h3'>
                  Selecting a Starter Model
                </Heading>
                <img src='../assets/graphics/content/guide-models.png' />
                <p>
                  The starter model selection screen displays information about
                  starter model seed data, class distribution and F1 scores,
                  training area, and label sources.
                </p>
                <Heading size='large' as='h2'>
                  Running inference and improving the model through retraining
                </Heading>
                <img src='../assets/graphics/content/guide-predictions.png' />
                <p>
                  Once the AOI is defined and the model selected, run inference
                  over your area by clicking on the “Run Inference” button. The
                  session status bar will indicate the progress of your
                  predictions. Once predictions are ready, they will load in
                  over the AOI as image tiles. The classes available from the
                  model are visible in the side left panel, along with the
                  Retrain, Refine, and Layer tools
                </p>
                <Heading size='medium' as='h3'>
                  Retraining
                </Heading>
                <img src='../assets/graphics/content/guide-retrain.png' />
                <p>
                  After receiving the initial model inference, retraining allows
                  users to modify the starter model to obtain more accurate
                  predictions for the selected AOI. The “Draw” and “Point” tools
                  allow users to select available classes and mark samples for
                  sending to the model. Draw allows free-hand creation of
                  polygons via mouse clicking and dragging, while points are
                  placed as individual movable markers. When a user draws a
                  polygon during retraining 100 points are randomly sampled from
                  that polygon and used for retraining.
                </p>
                <p>
                  The “Erase” tool allows the deletion of points and polygons
                  via mouse click, and subtraction from polygons while clicking
                  and dragging.
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
                <Heading size='medium' as='h3'>
                  Prediction Analysis
                </Heading>
                <img src='../assets/graphics/content/guide-analysis.png' />
                <p>
                  After submitting retraining samples, the analysis panel will
                  populate with metrics on class distribution and class f1
                  scores. Use the analysis to compare your expected
                  understanding of an area’s land cover classes with the
                  returned results. Class F1 scores can help you compare the
                  accuracy of classes to{' '}
                </p>
                <Heading size='large' as='h2'>
                  Saving your work using checkpoints
                </Heading>
                <img src='../assets/graphics/content/guide-checkpoint.png' />
                <p>
                  After retraining, save the current state of your model via a
                  checkpoint. Click “Save Checkpoint” to provide a unique name
                  for your current checkpoint. Checkpoints are a point in the
                  history of the model which you would like to save and reuse
                  later. Internally, checkpoints store the unique set of model
                  weights based on the retraining steps you took.
                </p>
                <Heading size='large' as='h2'>
                  Refining the map output
                </Heading>
                <img src='../assets/graphics/content/guide-refine.png' />
                <p>
                  After inspecting your model output, you can manually apply
                  refinements to paint over an area of the map with individual
                  classes or previous checkpoints. Refinements can be used to
                  smooth areas that your model consistently misidentifies or
                  which you wish to normalize. Select either an individual class
                  or a previous checkpoint, then select the “Draw” tool to
                  designate areas on your map to fill with your selected type.
                  After drawing multiple areas, click "Save Refinements" to add
                  your changes to the map.
                </p>
                <Heading size='large' as='h2'>
                  Sharing Maps
                </Heading>
                <img src='../assets/graphics/content/guide-export.png' />
                <p>
                  There are two ways to share your LULC maps — downloading a
                  GeoTIFF or an interactive map URL that can be embedded. Once
                  an inference is generated and you are satisfied with the
                  output, click on the Export button on the top right corner.
                </p>
                <Heading size='large' as='h2'>
                  Limitations
                </Heading>
                <ul>
                  <li>
                    This platform is currently limited to run on NAIP imagery in
                    the United States.
                  </li>
                  <li>
                    It is possible to run inference over all of the US, however
                    the starter models were only trained in the north eastern
                    United States with data from West Virginia, Maryland,
                    Pennsylvania, New York, Delaware, and Virgina due to labeled
                    data constraints. There might be a drop in inference
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
                  <li>
                    GPUs are limited. At the moment, we can scale reliably up to
                    32 simultaneous users. Some users may get assigned to a CPU
                    instance.
                  </li>
                </ul>
              </Prose>
            </InpageBodyInner>
          </AboutBody>
        </PageBody>
      </App>
    );
  }
}

export default About;
