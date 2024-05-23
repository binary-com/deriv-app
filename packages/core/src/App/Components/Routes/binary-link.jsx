import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { findRouteByPath, normalizePath } from './helpers';
import getRoutesConfig from '../../Constants/routes-config';
import { observer, useStore } from '@deriv/stores';

// TODO: solve circular dependency problem
// when binary link is imported into components present in routes config
// or into their descendants
const BinaryLink = observer(({ active_class, to, children, href, ...props }) => {
    const { common } = useStore();
    const { has_error, error } = common;
    const setError = error.setError;
    const path = normalizePath(to);
    const route = findRouteByPath(path, getRoutesConfig());

    if (!route && to) {
        throw new Error(`Route not found: ${to}`);
    }

    return to && !href ? (
        <span
            data-testid='dt_span'
            className={classNames({
                [`${active_class}__link-wrapper`]: !!active_class,
            })}
            onClick={() => {
                if (has_error) setError(false, null);
            }}
        >
            <NavLink to={path} activeClassName={active_class || 'active'} exact={route.exact} {...props}>
                {children}
            </NavLink>
        </span>
    ) : (
        <a data-testid='dt_link' {...props}>
            {children}
        </a>
    );
});

BinaryLink.propTypes = {
    active_class: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
    href: PropTypes.string,
    to: PropTypes.string,
};

export default BinaryLink;
