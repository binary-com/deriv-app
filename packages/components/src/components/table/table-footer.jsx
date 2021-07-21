import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Footer = ({ children, className }) => (
    <div role='rowgroup' className={classNames('dc-table__footer', className)}>
        {children}
    </div>
);

Footer.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Footer;
