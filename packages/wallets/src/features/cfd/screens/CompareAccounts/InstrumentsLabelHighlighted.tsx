import React from 'react';
import classNames from 'classnames';
import { useTranslations } from '@deriv-com/translations';
import { THooks, TPlatforms } from '../../../../types';
import { getHighlightedIconLabel } from './compareAccountsConfig';
import InstrumentsIconWithLabel from './InstrumentsIconWithLabel';
import './InstrumentsLabelHighlighted.scss';

type TInstrumentsLabelHighlighted = {
    isDemo: boolean;
    isEuRegion: boolean;
    marketType: THooks.AvailableMT5Accounts['market_type'];
    platform: TPlatforms.All;
    product?: THooks.AvailableMT5Accounts['product'];
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

const InstrumentsLabelHighlighted = ({
    isDemo,
    isEuRegion,
    marketType,
    platform,
    product,
    shortCode,
}: TInstrumentsLabelHighlighted) => {
    const { localize } = useTranslations();
    const iconData = [...getHighlightedIconLabel(platform, isEuRegion, localize, marketType, shortCode, product)];

    return (
        <div
            className={classNames('wallets-compare-accounts-outline', {
                'wallets-compare-accounts-outline--demo': isDemo,
            })}
            data-testid='dt_compare_cfd_account_outline__container'
        >
            {iconData.map(item => (
                <InstrumentsIconWithLabel key={item.text} {...item} />
            ))}
        </div>
    );
};

export default InstrumentsLabelHighlighted;
