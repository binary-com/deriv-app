import PropTypes  from 'prop-types';
import React      from 'react';
import Icon       from 'Assets/Common';

const ChartCloseBtn = ({
    is_contract_mode,
    onClose,
}) => {
    if (!is_contract_mode) return null;
    return (
        <div
            className='chart-close-btn'
            onClick={onClose}
        >
            <Icon
                icon='IconContractClose'
                className='ic-chart-close'
            />
        </div>
    );
};

ChartCloseBtn.propTypes = {
    is_contract_mode: PropTypes.bool,
    onClose         : PropTypes.func,
};

export default ChartCloseBtn;
