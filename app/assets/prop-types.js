import PropTypes from 'prop-types';

export const StacMosaicPropTypes = PropTypes.shape({
  name: PropTypes.string.isRequired,
  cql: PropTypes.array.isRequired,
});
