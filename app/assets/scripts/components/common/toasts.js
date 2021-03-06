import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';

import { Button } from '@devseed-ui/button';

const ButtonIconXmark = styled(Button)`
  transform: translate(0.25rem, -0.25rem) !important;
`;

// The close button is set globally in the toast container.
export const CloseButton = ({ closeToast }) => (
  <ButtonIconXmark
    data-cy='toast-close-button'
    className='toast-close-button'
    variation='achromic-plain'
    size='small'
    useIcon='xmark--small'
    hideText
    onClick={closeToast}
  >
    Dismiss notification
  </ButtonIconXmark>
);

CloseButton.propTypes = {
  closeToast: PropTypes.func,
};

export const ToastContainerCustom = () => (
  <ToastContainer
    containerId='a-toast'
    position={toast.POSITION.BOTTOM_RIGHT}
    closeButton={<CloseButton />}
  />
);

const defaultOptions = {
  autoClose: 5000,
  hideProgressBar: true,
};

const toasts = {
  error: (content, opts) =>
    toast.error(content, { ...defaultOptions, ...opts }),
  success: (content, opts) =>
    toast.success(content, { ...defaultOptions, ...opts }),
  info: (content, opts) => toast.info(content, { ...defaultOptions, ...opts }),
  warn: (content, opts) => toast.warn(content, { ...defaultOptions, ...opts }),
};

export default toasts;
