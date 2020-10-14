import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Text = ({ children, size, color, align, weight, lineHeight, className }) => (
    <p
        className={classNames('text', className, {
            // font-weight
            'text--bold': weight === 'bold',
            'text--normal': weight === 'normal',
            'text--semibold': weight === 'semibold',
            'text--light': weight === 'light',
            // font-size
            'text--xheading': size === 'xheading',
            'text--heading': size === 'heading',
            'text--large': size === 'large',
            'text--title': size === 'title',
            'text--paragraph': size === 'paragraph',
            'text--small': size === 'small',
            'text--xsmall': size === 'xsmall',
            'text--xxsmall': size === 'xxsmall',
            'text--xxxsmall': size === 'xxxsmall',
            // font-color
            'text--grey': color === 'grey',
            'text--prominent': color === 'prominent',
            'text--red': color === 'red',
            'text--active': color === 'active',
            'text--black': color === 'black',
            'text--disabled': color === 'disabled',
            'text--green': color === 'green',
            // text-align
            'text--right': align === 'right',
            'text--left': align === 'left',
            'text--center': align === 'center',
            // line-height
            'text__line-height--large': lineHeight === 'large',
            'text__line-height--medium': lineHeight === 'medium',
            'text__line-height--small': lineHeight === 'small',
            'text__line-height--xsmall': lineHeight === 'xsmall',
        })}
    >
        {children}
    </p>
);

Text.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

export default Text;
