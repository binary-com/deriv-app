import React, { FC } from 'react';
import { Text } from '@deriv/quill-design';
import InstrumentsIcons from '../../../../public/images/cfd/tradingInstruments';

type TInstrumentsIcon = {
    highlighted: boolean;
    icon: keyof typeof InstrumentsIcons;
    isAsterisk?: boolean;
    text: string;
};

const InstrumentsIconWithLabel: FC<TInstrumentsIcon> = ({ highlighted, icon, isAsterisk, text }) => {
    const InstrumentIcon = InstrumentsIcons[icon];
    return (
        <div
            className='flex items-center cursor-not-allowed m-100'
            data-testid='dt_instruments_icon_container'
            style={{
                opacity: highlighted ? '' : '0.2',
            }}
        >
            <InstrumentIcon height={24} width={24} />
            <div className='ml-[5px]'>
                <Text bold size='sm'>
                    {text}
                </Text>
            </div>
            {isAsterisk && <span className='relative text-[16px] top-100 text-brand-red-light'>*</span>}
        </div>
    );
};

export default InstrumentsIconWithLabel;
