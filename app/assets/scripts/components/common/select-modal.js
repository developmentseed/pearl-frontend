import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Modal } from '@devseed-ui/modal';
import { Heading } from '@devseed-ui/typography';
import CardList from './card-list';

const HeaderWrapper = styled(Modal)`
  display: block;
  padding: 2rem 2rem 0 2rem;
`;

const Headline = styled.h3`
  text-align: center;
`;

const ModalContent = styled.div`
  display: block;
`;

const ListSection = styled.div`
  padding: 0.5rem 0;
  > ${Heading} {
    padding-bottom: 0.5rem;
  }
`;

export const ModalHeader = ({ id, title, children }) => {
  return (
    <HeaderWrapper id={id}>
      <Headline>{title}</Headline>
      {children}
    </HeaderWrapper>
  );
};

ModalHeader.propTypes = {
  id: T.string,
  title: T.string,
  children: T.node,
};

function SelectModal(props) {
  const {
    id,
    revealed,
    onOverlayClick,
    data,
    renderHeader,
    renderCard,
    filterCard,
    size,
    nonScrolling,
  } = props;
  const recommendedModels = data.filter((model) => model.overlapsAoi);
  const otherModels = data.filter((model) => !model.overlapsAoi);

  return (
    <Modal
      id={id}
      className='select'
      size={size || 'xlarge'}
      revealed={revealed}
      onOverlayClick={onOverlayClick}
      closeButton={false}
      renderHeader={renderHeader}
      filterCard={filterCard}
      content={
        <ModalContent>
          {recommendedModels.length > 0 && (
            <ListSection data-cy='recommended-models-list'>
              <Heading size='small' as='h4'>
                Recommended models for your AOI
              </Heading>
              <CardList
                numColumns={2}
                data={recommendedModels}
                renderCard={renderCard}
                filterCard={filterCard}
                nonScrolling={nonScrolling}
              />
            </ListSection>
          )}
          {otherModels.length > 0 && (
            <ListSection data-cy='all-models-list'>
              <Heading size='small' as='h4'>
                All available models
              </Heading>
              <CardList
                numColumns={2}
                data={otherModels}
                renderCard={renderCard}
                filterCard={filterCard}
                nonScrolling={nonScrolling}
              />
            </ListSection>
          )}
        </ModalContent>
      }
    />
  );
}

SelectModal.propTypes = {
  id: T.string,
  revealed: T.bool,
  onOverlayClick: T.func,
  data: T.array,
  renderHeader: T.func,
  renderCard: T.func,
  filterCard: T.func,
  nonScrolling: T.bool,
  size: T.string,
};
export default SelectModal;
