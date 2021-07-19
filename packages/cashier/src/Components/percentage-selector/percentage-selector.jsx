import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const PercentageSelector = ({ amount, currency, getCalculatedAmount }) => {
    const [percentage, setPercentage] = React.useState('0');

    const calculateAmount = (e, percent) => {
        setPercentage(percent);

        for (let i = 1; i <= 4; i++) {
            if (i <= e.target.id) {
                document.getElementById(i).style.backgroundColor = 'blue'; // TODO: Change color when design is updated
            } else {
                document.getElementById(i).style.backgroundColor = '#f2f3f4';
            }
        }
        getCalculatedAmount(amount * (percentage / 100));
    };

    return (
        <React.Fragment>
            <div className='percentage-selector'>
                <div className='percentage-selector__block-container'>
                    <Text color='prominent' size='xs'>
                        {'25%'}
                    </Text>
                    <div id='1' className='percentage-selector-block' onClick={e => calculateAmount(e, 25)} />
                </div>
                <div className='percentage-selector__block-container'>
                    <Text color='prominent' size='xs'>
                        {'50%'}
                    </Text>
                    <div id='2' className='percentage-selector-block' onClick={e => calculateAmount(e, 50)} />
                </div>
                <div className='percentage-selector__block-container'>
                    <Text color='prominent' size='xs'>
                        {'75%'}
                    </Text>
                    <div id='3' className='percentage-selector-block' onClick={e => calculateAmount(e, 75)} />
                </div>
                <div className='percentage-selector__block-container'>
                    <Text color='prominent' size='xs'>
                        <Localize i18n_default_text='All' />
                    </Text>
                    <div id='4' className='percentage-selector-block' onClick={e => calculateAmount(e, 100)} />
                </div>
            </div>
            <Text color='less-prominent' size='s'>
                <Localize i18n_default_text={`${percentage}% of available balance (${amount} ${currency})`} />
            </Text>
        </React.Fragment>
    );
};

PercentageSelector.propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    total_amount: PropTypes.number,
};

export default PercentageSelector;
