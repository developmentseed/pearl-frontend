import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ProjectMachineContext } from '../../../../../../../fsm/project';
import selectors from '../../../../../../../fsm/project/selectors';
import { formatDateTime } from '../../../../../../../utils/format';
import * as guards from '../../../../../../../fsm/project/guards';

import { Heading } from '@devseed-ui/typography';
import CardList, { Card } from '../../../../../../common/card-list';

const HeadingWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: baseline;
`;

export const ExistingMosaicsSection = ({ setShowModal }) => {
  const actorRef = ProjectMachineContext.useActorRef();
  const isProjectNew = ProjectMachineContext.useSelector((s) =>
    guards.isProjectNew(s.context)
  );
  const mosaicsList = ProjectMachineContext.useSelector(selectors.mosaicsList);
  const currentMosaic = ProjectMachineContext.useSelector(
    selectors.currentMosaic
  );
  const currentImagerySource = ProjectMachineContext.useSelector(
    selectors.currentImagerySource
  );

  const selectableMosaics = mosaicsList.filter(
    (mosaic) => mosaic.imagery_source_id === currentImagerySource?.id
  );

  return (
    <>
      <HeadingWrapper>
        <Heading size='small' as='h4'>
          Available mosaics for the AOI
        </Heading>
      </HeadingWrapper>
      <CardList
        nonScrolling
        numColumns={2}
        data={selectableMosaics}
        renderCard={(mosaic) => {
          const { name, mosaic_ts_end, mosaic_ts_start } = mosaic;

          return (
            <Card
              data-cy={`select-mosaic-${mosaic.id}-card`}
              key={mosaic.id}
              title={mosaic.name}
              details={{
                name,
                'Mosaic Start Date': mosaic_ts_start
                  ? formatDateTime(mosaic_ts_start)
                  : 'N/A',
                'Mosaic End Date': mosaic_ts_end
                  ? formatDateTime(mosaic_ts_end)
                  : 'N/A',
              }}
              borderlessMedia
              selected={currentMosaic && currentMosaic.id === mosaic.id}
              onClick={() => {
                if (isProjectNew) {
                  if (!currentMosaic || currentMosaic.id !== mosaic.id) {
                    actorRef.send({
                      type: 'Mosaic was selected',
                      data: { mosaic },
                    });
                  }
                } else if (currentMosaic?.id !== mosaic.id) {
                  actorRef.send({
                    type: 'Mosaic was selected',
                    data: { mosaic },
                  });
                }
                setShowModal(false);
              }}
            />
          );
        }}
      />{' '}
    </>
  );
};

ExistingMosaicsSection.propTypes = {
  setShowModal: PropTypes.func.isRequired,
};
