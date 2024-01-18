import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Modal } from '@devseed-ui/modal';
import { glsp } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import { ExistingMosaicsSection } from './sections/list-mosaics';
import { CreateMosaicSection } from './sections/create-mosaic';
import TabbedBlock from '../../../../../common/tabbed-block-body';

const ModalHeader = styled.header`
  padding: ${glsp(2)} ${glsp(2)} 0;
`;

const ModalContent = styled.div`
  display: block;
`;

const Headline = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: ${glsp(1)};

  h1 {
    margin: 0;
  }

  ${Button} {
    height: min-content;
    align-self: center;
  }
`;

export function MosaicSelectorModal({ showModal, setShowModal }) {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <Modal
      id='select-mosaic-modal'
      className='select'
      size='xlarge'
      revealed={showModal}
      onOverlayClick={() => setShowModal(false)}
      closeButton={false}
      renderHeader={() => (
        <ModalHeader>
          <Headline>
            <Heading>Set mosaic</Heading>
            <Button
              hideText
              variation='base-plain'
              size='small'
              useIcon='xmark'
              onClick={() => {
                setShowModal(false);
              }}
            >
              Close modal
            </Button>
          </Headline>
        </ModalHeader>
      )}
      content={
        <ModalContent>
          <TabbedBlock activeTab={activeTab}>
            <ExistingMosaicsSection
              name='Select Preset'
              className='select-preset-mosaic'
              tabId='select-preset-mosaic-tab-trigger'
              onTabClick={() => setActiveTab(0)}
              setShowModal={setShowModal}
            />
            <CreateMosaicSection
              name='Create Mosaic'
              className='create-mosaic'
              tabId='create-mosaic-tab-trigger'
              onTabClick={() => setActiveTab(1)}
              setShowModal={setShowModal}
            />
          </TabbedBlock>
        </ModalContent>
      }
    />
  );
}

MosaicSelectorModal.propTypes = {
  showModal: T.bool,
  setShowModal: T.func.isRequired,
};
