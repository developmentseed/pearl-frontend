import React, { useContext } from 'react';
import { Button } from '@devseed-ui/button';
import { ExploreContext } from '../../../context/explore';
import { viewModes } from '../../../context/map';

function RetrainModel() {
  const { setViewMode } = useContext(ExploreContext);

  return (
    <>
      <h3>Sample selection tools</h3>
      <Button variation='base-raised-light' size='medium' useIcon='crosshair'>
        Point
      </Button>
      <Button
        variation='base-raised-light'
        size='medium'
        useIcon='area'
        onClick={() => setViewMode(viewModes.EDIT_CLASS_MODE)}
      >
        Draw
      </Button>
      <Button variation='base-raised-light' size='medium' useIcon='erase'>
        Erase
      </Button>
    </>
  );
}

RetrainModel.propTypes = {};
export default RetrainModel;
