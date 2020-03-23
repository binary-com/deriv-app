import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

const ListItem = ({ onClick, is_active, label }) => (
    <li
        className={classNames({
            'composite-calendar__prepopulated-list--is-active': is_active,
        })}
        onClick={onClick}
    >
        {label}
    </li>
);

ListItem.propTypes = {
    label: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.array]),
    is_active: PropTypes.bool,
    onClick: PropTypes.func,
};

export default ListItem;
