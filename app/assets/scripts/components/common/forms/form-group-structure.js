import React from 'react';
import styled from 'styled-components';
import { PropTypes as T } from 'prop-types';
import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody,
  FormLabel as BaseFormLabel,
  FormHelper,
} from '@devseed-ui/form';
import { Toolbar } from '@devseed-ui/toolbar';

import InfoButton from '../../common/info-button';

const FormGroupFooter = styled.div`
  /* styled-component */
`;

const FormLabel = styled(BaseFormLabel)`
  align-items: baseline;
`;

/**
 * From group structure.
 *
 * @prop {string} id Id used in the <FormLabel htmlFor={id}>
 * @prop {string} label Label for the group
 * @prop {function|string} labelHint Hint for the label. Setting it to true
 * shows (optional)
 * @prop {string} description Description for the info popover.
 * @prop {string} toolbarItems Additional toolbar items to show on the toolbar.
 * They will be rendered inside a <Toolbar>
 * @prop {node} helper Helper message shown below children.
 * @prop {node} children Elements to render inside <FormGroupBody>
 * @prop {node} footerContent Elements to render inside <FormGroupFooter> after
 * <FormGroupBody>
 */
export default function FormGroupStructure(props) {
  const {
    id,
    label,
    labelHint,
    className,
    toolbarItems,
    description,
    helper,
    children,
    footerContent,
    hint,
    hideHeader,
  } = props;

  const hasToolbar = description || toolbarItems;

  const descComp = description && (
    <InfoButton
      key={`info-button-${id}`}
      id={`info-button-${id}`}
      info={description}
      useIcon='circle-information'
      hideText
    />
  );

  // Because of a @devseed-ui/toolbar bug, there can't be null/undefined
  // children on the toolbar.
  const toolbar = (
    <Toolbar size='small'>{[toolbarItems, descComp].filter(Boolean)}</Toolbar>
  );

  return (
    <FormGroup className={className}>
      <FormGroupHeader isHidden={hideHeader}>
        <FormLabel htmlFor={id} optional={labelHint}>
          {label}
        </FormLabel>
        {hasToolbar && toolbar}
      </FormGroupHeader>
      <FormGroupBody>
        {children}
        {(helper || hint) && <FormHelper>{helper || hint}</FormHelper>}
      </FormGroupBody>
      {footerContent && <FormGroupFooter>{footerContent}</FormGroupFooter>}
    </FormGroup>
  );
}

FormGroupStructure.propTypes = {
  id: T.string,
  label: T.string,
  labelHint: T.oneOfType([T.bool, T.func, T.string]),
  className: T.string,
  description: T.string,
  toolbarItems: T.object,
  helper: T.node,
  footerContent: T.node,
  children: T.node,
  hint: T.string,
  hideHeader: T.bool,
};
