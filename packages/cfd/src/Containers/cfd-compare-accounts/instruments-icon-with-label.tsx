import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { Text } from '@deriv/components';
import { TInstrumentsIcon } from 'Components/props.types';
import TradingInstrumentsIcon from '../../Assets/svgs/trading-instruments';

const InstrumentsIconWithLabel = ({ icon, text, highlighted, className, is_asterisk }: TInstrumentsIcon) => {
    const { isMobile } = useDevice();
    return (
        <div
            style={{
                opacity: highlighted ? '' : '0.2',
            }}
            data-testid='dt_instruments_icon_container'
            className={className}
        >
            <TradingInstrumentsIcon icon={icon} size={24} className='trading-instruments__icon' />
            <Text
                as='p'
                weight={isMobile ? 'normal' : 'bolder'}
                line_height='xs'
                size='xxs'
                align='left'
                className='trading-instruments__text'
            >
                {text}
                {is_asterisk && (
                    <Text color='loss-danger' size='xxs'>
                        *
                    </Text>
                )}
            </Text>
        </div>
    );
};

export default InstrumentsIconWithLabel;
