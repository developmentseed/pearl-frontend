import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Modal } from '@devseed-ui/modal';
import CardList from './card-list';

const BodyOuter = styled.div`
  height: 45vh;
`;

const HeaderWrapper = styled(Modal)`
  display: grid;
  grid-template-columns: 1fr;
`;

const Headline = styled.h3`
  text-align: center;
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
    filterCard
    size,
    nonScrolling,
  } = props;

  return (
    <Modal
      id={id}
      className='select'
      size={ size || 'xlarge'}
      revealed={revealed}
      onOverlayClick={onOverlayClick}
      closeButton={false}
      renderHeader={renderHeader}
      filterCard={filterCard}
      content={
        <BodyOuter>
          <CardList
            data={data}
            renderCard={renderCard}
            filterCard={filterCard}
            nonScrolling={nonScrolling}
          />
        </BodyOuter>
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
};
export default SelectModal;
