import React from 'react';
import { Button } from '@devseed-ui/button';

function RetrainModel() {
  return (
    <>
      <h3>Sample selection tools</h3>
      <Button variation='base-raised-light' size='medium' useIcon='crosshair'>
        Point
      </Button>
      <Button variation='base-raised-light' size='medium' useIcon='area'>
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
