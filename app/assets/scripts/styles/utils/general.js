import React from 'react';
import get from 'lodash.get';

/**
 * Return the a function that when executed appends the `unit` to the value.
 *
 * @example
 * const percent = unitify('%');
 * percent(10) // -> 10%
 *
 * @param {string} unit The unit to use
 */
export const unitify = unit => v =>
  typeof v === 'function' ? (...args) => `${v(...args)}${unit}` : `${v}${unit}`;

/**
 * Return the given value with `rem` appended.
 * If value is a function will execute it. This allows to use directly in
 * styled-components with themeVal
 *
 * @see themeVal()
 *
 * @example
 * rem(themeVal('shape.rounded'))
 *
 * @param {mixed} val The value
 */
export const rem = unitify('rem');

/**
 * Return the given value with `px` appended.
 * If value is a function will execute it. This allows to use directly in
 * styled-components with themeVal
 *
 * @see themeVal()
 *
 * @example
 * px(themeVal('shape.rounded'))
 *
 * @param {mixed} val The value
 */
export const px = unitify('px');

/**
 * Returns a function to be used with styled-components and gets a value from
 * the theme property.
 *
 * @param {string} path The path to get from theme
 */
export const themeVal = path => ({ theme }) => {
  const v = get(theme, path, undefined);
  if (v === undefined) {
    console.error( // eslint-disable-line
      `Theme Value Error: path [${path}] not found in theme.`,
      theme
    );
  }
  return v;
};

/**
 * Allows a function to be used with style-components interpolation, passing the
 * component props to each one of the functions arguments if those arguments are
 * functions.
 *
 * Useful in conjunction with themeVal. Instead of:
 * ${(props) => rgba(props.theme.colors.primaryColor, 0.16)}
 * you can do
 * ${rgbaFn(themeVal('colors.primaryColor'), 0.16)}
 *
 * @param {function} fn The function to wrap.
 *
 * @returns {function} Curried function
 */
export const stylizeFunction = (fn) => {
  return (...fnArgs) => (...props) => {
    const mappedArgs = fnArgs.map(arg => typeof arg === 'function' ? arg(...props) : arg);
    return fn(...mappedArgs);
  };
};

/**
 * Removes given props from the component returning a new one.
 * This is used to circumvent a bug with styled-component where unwanted props
 * are passed to the dom causing react to display an error:
 *
 * ```
 *   `Warning: React does not recognize the hideText prop on a DOM element.
 *   If you intentionally want it to appear in the DOM as a custom attribute,
 *   spell it as lowercase hideText instead. If you accidentally passed it from
 *   a parent component, remove it from the DOM element.`
 * ```
 *
 * This commonly happens when an element is impersonating another with the
 * `as` prop:
 *
 *     <Button hideText as={Link}>Home</Button>
 *
 * Because of a bug, all the props passed to `Button` are passed to `Link`
 * without being filtered before rendering, causing the aforementioned error.
 *
 * This utility creates a component that filter out unwanted props and can be
 * safely used as an impersonator.
 *
 *     const CleanLink = filterComponentProps(Link, ['hideText'])
 *     <Button hideText as={CleanLink}>Home</Button>
 *
 * Issue tracking the bug: https://github.com/styled-components/styled-components/issues/2131
 *
 * Note: The props to filter out are manually defined to reduce bundle size,
 * but it would be possible to automatically filter out all invalid props
 * using something like @emotion/is-prop-valid
 *
 * @param {object} Comp The react component
 * @param {array} filterProps Props to filter off of the component
 */
export function filterComponentProps (Comp, filterProps = []) {
  const isValidProp = p => !filterProps.includes(p);

  return React.forwardRef((rawProps, ref) => {
    const props = Object.keys(rawProps).reduce((acc, p) => (
      isValidProp(p) ? { ...acc, [p]: rawProps[p] } : acc
    ), {});
    return <Comp ref={ref} {...props} />;
  });
}

/* Transform string into title case */
export function makeTitleCase (text) {
  return text.split(' ').map(word => `${word[0].toUpperCase()}${word.slice(1)}`).join(' ');
}
