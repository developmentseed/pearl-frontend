import { NavLink } from 'react-router-dom';
import { filterComponentProps } from './utils/general';

// Please refer to filterComponentProps to understand why this is needed
const propsToFilter = ['variation', 'size', 'hideText', 'useIcon', 'active'];
const StyledNavLink = filterComponentProps(NavLink, propsToFilter);
export default StyledNavLink;
