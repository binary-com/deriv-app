import PropTypes from 'prop-types';
import React     from 'react';

const IconCashierError = ({ className }) => (
    <svg className={className} width='128' height='128' viewBox='0 0 128 128'>
        <g fill='none' fillRule='nonzero' transform='translate(5 5)'>
            <circle cx='59' cy='59' r='59' fill='#FF444F' />
            <path fill='#FFF' d='M53.049 81.01v-1.488c0-2.848 1.744-5.13 5.951-5.13s5.926 2.205 5.926 5.13v1.616c0 2.873-1.719 5.13-5.926 5.13s-5.951-2.385-5.951-5.258zm3.95-17.085l-3.155-18.957V32.142a6.644 6.644 0 0 1 5.13-2.822 6.516 6.516 0 0 1 5.13 2.822v12.826l-3.052 18.957a2.232 2.232 0 0 1-1.975 1.488 2.206 2.206 0 0 1-2.078-1.488z' />
        </g>
    </svg>
);

IconCashierError.propTypes = {
    className: PropTypes.string,
};

export default IconCashierError;
