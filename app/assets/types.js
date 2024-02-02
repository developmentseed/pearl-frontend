import PropTypes from 'prop-types';

export const StacCollectionType = PropTypes.shape({
  acquisitionStart: PropTypes.string.isRequired,
  acquisitionEnd: PropTypes.string.isRequired,
});
