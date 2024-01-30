import PropTypes from 'prop-types';

export const StacMosaicType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  cql: PropTypes.array.isRequired,
});

export const StacCollectionType = PropTypes.shape({
  mosaicPresets: PropTypes.arrayOf(StacMosaicType).isRequired,
  temporalExtent: (props, propName, componentName) => {
    const value = props[propName];

    if (!Array.isArray(value) || value.length !== 2) {
      return new Error(
        `${propName} in ${componentName} must be an array of two elements.`
      );
    }

    if (
      (value[0] !== null && typeof value[0] !== 'string') ||
      (value[1] !== null && typeof value[1] !== 'string')
    ) {
      return new Error(
        `Both elements of ${propName} in ${componentName} must be strings or null.`
      );
    }

    return null;
  },
});
