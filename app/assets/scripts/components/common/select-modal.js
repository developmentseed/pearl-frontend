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

const HeadingWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: baseline;
`;

const LabeledSpan = styled.span`
  position: relative;
  &:after {
    content: ' ';
    position: absolute;
    height: 16px;
    width: 16px;
    background: #07b598;
    left: -24px;
    bottom: 4px;
    border-radius: 0.125rem;
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
          <HeadingWrapper>
            <Heading size='small' as='h4'>
              Available Models
            </Heading>
            {recommendedModels.length > 0 && (
              <LabeledSpan data-cy='recommended-models-label'>
                Recommended based on your selected AOI
              </LabeledSpan>
            )}
          </HeadingWrapper>
          <CardList
            numColumns={2}
            data={data.sort((a, b) => b.overlapsAoi - a.overlapsAoi)}
            renderCard={renderCard}
            filterCard={filterCard}
            nonScrolling={nonScrolling}
          />
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
