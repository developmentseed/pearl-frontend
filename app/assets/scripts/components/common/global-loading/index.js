import React, { useEffect, useState } from 'react';
import T from 'prop-types';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import {
  BodyUnscrollable,
  GlobalLoadingWrapper,
  Message,
  Spinner,
} from './styles';

// DEV NOTE:
// This component is set up to be a standalone instance with programmatic
// access. This means that the component has to be mounted once in the DOM and
// then can be controlled through functions, without the need to render react
// components. This is particularly useful when a loading indicator needs to be
// shown from inside a callback.
// The <GlobalLoadingProvider> is the element that has to mounted and it will
// store several variables in a local file scope. This may seem to go against
// react practices, but is a deviation from the rules to be able to provide the
// programmatic API.
// It is also possible to control the display of the global loading through the
// use of a react component (<GlobalLoading />). This acts as a faux component
// that calls the programmatic api when it is mounted, therefore the
// <GlobalLoadingProvider> still has to be mounted.

// From a UX standpoint, the element has to be present in the DOM long enough to
// be registered by the user. Therefore the loading will be shown for at least
// 512ms (by default), even if the action takes 1ms.
let MIN_TIME = 512;

// Since we have a minimum display time we use a timeout to hide it if when the
// hide method is called the time isn't over yet. However, if in the mean time
// the loading is shown again we need to clear the timeout.
let hideTimeout = null;

// Initial state of the global loading.
const initialState = {
  showTimestamp: null,
  message: null,
  revealed: false,
};

// Store whether the component was mounted or not. This has a double purpose:
// - Prevents the component from erroring when rendering server side.
// - Displays an error if the programmatic api is called without the component
//   being mounted in the DOM
let globalLoadingMounted = false;

// Variables to hold the result of the component's useState. They need to be
// stored globally because of the programmatic access.
let glState;
let setGlState;

// Store the amount of global loading calls so we can keep it visible until all
// were hidden. Each programmatic api call increments a counter, which has to be
// equally decremented for the loading to be hidden. This is useful when
// multiple loadings are displayed from different callbacks, ensuring the each
// one of them has to hide their own created loading.
let globalLoadingCount = 0;

/**
 * Base component for the global loading
 * @param {object} props Component props
 */
export default function GlobalLoadingProvider(props) {
  [glState, setGlState] = useState(initialState);
  const { revealed, message } = glState;

  // Update the store min time.
  MIN_TIME = props.minTime || MIN_TIME;

  // Will be called on initial mount.
  // Reset variables when this is mounted.
  useEffect(() => {
    globalLoadingMounted = true;
    globalLoadingCount = 0;
    return () => {
      globalLoadingMounted = false;
    };
  }, []);

  // Note:
  // This check is necessary for this component to work when used with SSR.
  // While react-portal will itself check if window is available, that is not
  // enough to ensure that there aren't discrepancies between what the server
  // renders and what the client renders, as the client *will* have access to
  // the window. Therefore, we should only render the root level portal element
  // once the component has actually mounted, as determined by a state variable.
  if (!globalLoadingMounted) {
    return null;
  }

  return createPortal(
    <CSSTransition
      in={revealed}
      unmountOnExit
      appear
      classNames='overlay-loader'
      timeout={{ enter: 300, exit: 300 }}
    >
      <GlobalLoadingWrapper
        className={props.className}
        data-testid='global-loading'
      >
        <BodyUnscrollable />
        <Spinner />
        {message && <Message>{message}</Message>}
      </GlobalLoadingWrapper>
    </CSSTransition>,
    document.body
  );
}

GlobalLoadingProvider.propTypes = {
  minTime: T.number,
};

/**
 * Programmatic api to show a global loading.
 *
 * The <GlobalLoadingProvider> must be mounted.
 * The loading has a minimum visible time defined by the MIN_TIME constant.
 * This will prevent flickers in the interface when the action is very fast.
 *
 * @param  {object} options Options for the global loading.
 * @param  {number} options.count Define how many loadings to show. This will
 *                  not show multiple loadings on the page but will increment a
 *                  counter. This is helpful when there are many actions that
 *                  require a loading. The global loading will only be dismissed
 *                  once all counters shown are hidden. Each function call will
 *                  increment the counter. Default 1.
 * @param {boolean} options.force Sets the count to the given value without
 *                  incrementing. Default false.
 * @param {string} options.message Sets an optional message to display. Default
 *                 to empty.
 *
 * @example
 * showGlobalLoading()
 * // Counter set to 1
 * showGlobalLoading({ count: 3 })
 * // Counter set to 4
 * hideGlobalLoading()
 * // Counter is now 3
 * hideGlobalLoading({ count: 3 })
 * // Counter is now 0 and the loading is dismissed.
 */
export function showGlobalLoading(options = {}) {
  return new Promise((resolve) => {
    const { count = 1, force, message = null } = options;

    if (!globalLoadingMounted) {
      throw new Error('<GlobalLoadingProvider /> component not mounted');
    }

    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }

    globalLoadingCount = force ? count : globalLoadingCount + count;

    setGlState({
      showTimestamp: Date.now(),
      message,
      revealed: true,
    });

    resolve();
  });
}

/**
 * Programmatic api to hide a global loading.
 *
 * The <GlobalLoadingProvider> must be mounted.
 *
 * @param  {object} options Options for the global loading.
 * @param  {number} options.count Define how many loadings to show. This will
 *                  not show multiple loadings on the page but will increment a
 *                  counter. This is helpful when there are many actions that
 *                  require a loading. The global loading will only be dismissed
 *                  once all counters shown are hidden. Each function call will
 *                  increment the counter. Default 1.
 * @param {boolean} options.force Sets the count to the given value without
 *                  incrementing. Default false.
 *
 * @example
 * showGlobalLoading()
 * // Counter set to 1
 * showGlobalLoading({ count: 3 })
 * // Counter set to 4
 * hideGlobalLoading()
 * // Counter is now 3
 * hideGlobalLoading({ count: 3 })
 * // Counter is now 0 and the loading is dismissed.
 */
export function hideGlobalLoading(options = {}) {
  return new Promise((resolve) => {
    const { count = 1, force } = options;

    if (globalLoadingMounted === null) {
      throw new Error('<GlobalLoading /> component not mounted');
    }

    const hide = () => {
      setGlState({
        ...glState,
        revealed: false,
      });
      resolve();
    };

    // Using 0 or negative numbers results in the loading being
    // immediately dismissed.
    if (count < 1) {
      globalLoadingCount = 0;
      return hide();
    }

    // Decrement counter by given amount without going below 0.
    globalLoadingCount = Math.max(
      0,
      force ? count : globalLoadingCount - count
    );

    const time = glState.showTimestamp;
    const diff = Date.now() - time;

    if (diff >= MIN_TIME) {
      if (globalLoadingCount === 0) return hide();
    } else {
      hideTimeout = setTimeout(() => {
        if (globalLoadingCount === 0) return hide();
      }, MIN_TIME - diff);
    }
  });
}

/**
 * Programmatic api to show a global loading with a message.
 *
 * The <GlobalLoadingProvider> must be mounted.
 * Each call to showGlobalLoadingMessage will update the global loading message
 * but not increment the internal counter, show a single call to
 * hideGlobalLoading will dismiss it
 *
 * @param {string} message Message to display
 */
export function showGlobalLoadingMessage(message) {
  return showGlobalLoading({
    count: 1,
    force: true,
    message,
  });
}

/**
 * React component to show/hide a Global loading via mounting and unmounting.
 * If children are passed, they are used as a message, so it is recommended to
 * use a string.
 *
 * @param {*} props Component props
 */
export function GlobalLoading(props) {
  useEffect(() => {
    if (props.children) {
      showGlobalLoadingMessage(props.children);
    } else {
      showGlobalLoading();
    }

    return () => {
      hideGlobalLoading();
    };
    // The updating because of changing children is happening below.
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  useEffect(() => {
    if (props.children) {
      showGlobalLoadingMessage(props.children);
    }
  }, [props.children]);

  return null;
}

GlobalLoading.propTypes = {
  children: T.node,
};
