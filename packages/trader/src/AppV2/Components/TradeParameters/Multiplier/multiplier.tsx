import React, { useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ActionSheet, Skeleton, TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import Carousel from 'AppV2/Components/Carousel';
import CarouselHeader from 'AppV2/Components/Carousel/carousel-header';
import TradeParamDefinition from 'AppV2/Components/TradeParamDefinition';
import { isSmallScreen } from 'AppV2/Utils/trade-params-utils';
import MultiplierWheelPicker from './multiplier-wheel-picker';

type TMultiplierProps = {
    is_minimized?: boolean;
};

const Multiplier = observer(({ is_minimized }: TMultiplierProps) => {
    const { multiplier, multiplier_range_list, commission, onChange, currency } = useTraderStore();

    const [isOpen, setIsOpen] = useState(false);
    const is_small_screen_device = isSmallScreen();
    const classname = clsx('trade-params__option', is_minimized && 'trade-params__option--minimized');

    const handleMultiplierChange = (multiplier: number) => {
        onChange({ target: { name: 'multiplier', value: multiplier } });
    };

    const action_sheet_content = [
        {
            id: 1,
            component: (
                <MultiplierWheelPicker
                    multiplier={multiplier}
                    multiplier_range_list={multiplier_range_list}
                    currency={currency}
                    commission={commission}
                    setMultiplier={handleMultiplierChange}
                />
            ),
        },
        {
            id: 2,
            component: (
                <TradeParamDefinition
                    description={
                        <Localize i18n_default_text='Multipliers amplify your potential profit if the market moves in your favour, with losses limited to your initial capital.' />
                    }
                />
            ),
        },
    ];

    if (!multiplier)
        return (
            <div className={classname}>
                <Skeleton.Square />
            </div>
        );

    return (
        <React.Fragment>
            <TextField
                variant='fill'
                readOnly
                label={
                    <Localize i18n_default_text='Multiplier' key={`multiplier${is_minimized ? '-minimized' : ''}`} />
                }
                value={`x${multiplier}`}
                className={classname}
                onClick={() => setIsOpen(true)}
            />
            <ActionSheet.Root
                expandable={false}
                isOpen={isOpen}
                position='left'
                onClose={() => {
                    setIsOpen(false);
                }}
            >
                <ActionSheet.Portal shouldCloseOnDrag>
                    <Carousel
                        classname={clsx(
                            'multiplier__carousel',
                            is_small_screen_device && 'multiplier__carousel--small'
                        )}
                        header={CarouselHeader}
                        pages={action_sheet_content}
                        title={<Localize i18n_default_text='Multiplier' />}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
});

export default Multiplier;
