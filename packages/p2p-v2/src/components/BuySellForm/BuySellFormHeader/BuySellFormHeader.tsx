import React from 'react';
import { Text, useDevice } from '@deriv-com/ui';

type TBuySellFormHeaderProps = {
    currency?: string;
    isBuy: boolean;
};

const BuySellFormHeader = ({ currency = '', isBuy }: TBuySellFormHeaderProps) => {
    const { isMobile } = useDevice();

    return (
        <Text size={isMobile ? 'lg' : 'md'} weight='bold'>
            {`${isBuy ? 'Sell' : 'Buy'} ${currency}`}
        </Text>
    );
};

export default BuySellFormHeader;
