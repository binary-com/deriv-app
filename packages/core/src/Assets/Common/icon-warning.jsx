import PropTypes from 'prop-types';
import React     from 'react';

const IconWarning = ({ className }) => (
    <svg className={className} xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
        <path d='M8 0a8 8 0 110 16A8 8 0 018 0zm0 10.7c-.4 0-.7.1-1 .4-.2.2-.3.5-.3.9s.1.7.4 1c.2.2.5.3.9.3s.7-.1 1-.4c.2-.2.3-.5.3-.9s-.1-.7-.4-1c-.2-.2-.5-.3-.9-.3zm1.2-7.4c-.3-.5-.9-.7-1.5-.6-.6.2-1 .7-1 1.3v1L7 9.3c0 .5.5.8 1 .8.6 0 1-.4 1-.8v-.9l.2-2.6.1-1.8v-.6z' fill='#FFAD3A' fillRule='nonzero' />
    </svg>
);

IconWarning.propTypes = {
    className: PropTypes.string,
};

export default IconWarning;
