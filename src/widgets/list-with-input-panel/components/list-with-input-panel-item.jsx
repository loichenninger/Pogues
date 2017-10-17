import React from 'react';
import PropTypes from 'prop-types';
import classSet from 'react-classset';

import { LIST_WITH_INPUT_PANEL_WIDGET } from 'constants/dom-constants';

const { ITEM_CLASS, ITEM_INVALID_CLASS } = LIST_WITH_INPUT_PANEL_WIDGET;

// PropTypes and defaultProps

export const propTypes = {
  children: PropTypes.string.isRequired,
  invalid: PropTypes.bool,
};

export const defaultProps = {
  invalid: false,
};

// Component

function ListWithInputPanelItem({ children, invalid }) {
  return (
    <li
      className={classSet({
        [ITEM_CLASS]: true,
        [ITEM_INVALID_CLASS]: invalid,
      })}
    >
      {children}
    </li>
  );
}

ListWithInputPanelItem.propTypes = propTypes;
ListWithInputPanelItem.defaultProps = defaultProps;

export default ListWithInputPanelItem;
