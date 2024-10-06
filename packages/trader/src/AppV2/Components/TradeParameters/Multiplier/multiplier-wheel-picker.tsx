import React, { useEffect } from 'react';
import { ActionSheet, Text, WheelPicker, Skeleton } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import debounce from 'lodash.debounce';
import { formatMoney } from '@deriv/shared';

type TMultiplierWheelPickerProps = {
    multiplier: ReturnType<typeof useTraderStore>['multiplier'];
    multiplier_range_list: ReturnType<typeof useTraderStore>['multiplier_range_list'];
    currency: ReturnType<typeof useTraderStore>['currency'];
    commission: ReturnType<typeof useTraderStore>['commission'];
    setMultiplier: (multiplier: number) => void;
};

const debouncedSetMultiplier = debounce((setMultiplier, multiplier) => {
    setMultiplier(multiplier);
}, 200);

const MultiplierWheelPicker = ({
    multiplier,
    multiplier_range_list = [],
    currency,
    commission,
    setMultiplier,
}: TMultiplierWheelPickerProps) => {
    const multiplier_array = multiplier_range_list.map(item => ({ value: item.text }));
    const initial_multiplier = React.useRef<number>(multiplier);
    const selected_multiplier = React.useRef<number>(multiplier);

    useEffect(() => {
        return () => {
            if (initial_multiplier.current && initial_multiplier.current !== selected_multiplier.current) {
                setMultiplier(initial_multiplier.current);
            }
            debouncedSetMultiplier.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePickerValuesChange = (value: string | number) => {
        const new_value = Number((value as string).slice(1));
        if (new_value === selected_multiplier.current) return;
        debouncedSetMultiplier(setMultiplier, new_value);
        selected_multiplier.current = Number(new_value);
    };

    const handleSave = () => {
        initial_multiplier.current = selected_multiplier.current;
    };
    return (
        <React.Fragment>
            <ActionSheet.Content className='multiplier__picker'>
                <div className='multiplier__wheel-picker'>
                    {multiplier_array.length ? (
                        <WheelPicker
                            data={multiplier_array}
                            selectedValue={`x${selected_multiplier.current}`}
                            setSelectedValue={handlePickerValuesChange}
                        />
                    ) : (
                        <Skeleton.Square />
                    )}
                </div>
                <div className='multiplier__commission'>
                    <Text color='quill-typography__color--subtle' size='sm'>
                        <Localize i18n_default_text='Commission' />
                    </Text>
                    <Text size='sm' as='div' className='multiplier__commission-value'>
                        {commission ? (
                            <React.Fragment>
                                {formatMoney(currency, commission, true)} {currency}
                            </React.Fragment>
                        ) : (
                            <Skeleton.Square width={60} height={14} />
                        )}
                    </Text>
                </div>
            </ActionSheet.Content>
            <ActionSheet.Footer
                isPrimaryButtonDisabled={false}
                shouldCloseOnPrimaryButtonClick
                primaryAction={{
                    content: <Localize i18n_default_text='Save' />,
                    onAction: handleSave,
                }}
            />
        </React.Fragment>
    );
};

export default MultiplierWheelPicker;
