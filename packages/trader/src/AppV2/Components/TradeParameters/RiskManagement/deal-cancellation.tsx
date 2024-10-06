import React from 'react';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { Button, Skeleton, Text, ToggleSwitch, WheelPicker, useSnackbar } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { addUnit, getSnackBarText } from 'AppV2/Utils/trade-params-utils';

type TDealCancellationProps = {
    closeActionSheet: () => void;
};

const DealCancellation = observer(({ closeActionSheet }: TDealCancellationProps) => {
    const {
        has_cancellation,
        has_take_profit,
        has_stop_loss,
        cancellation_range_list,
        cancellation_duration,
        onChangeMultiple,
    } = useTraderStore();
    const { addSnackbar } = useSnackbar();

    const [is_enabled, setIsEnabled] = React.useState(has_cancellation);
    const [selected_value, setSelectedValue] = React.useState(cancellation_duration);

    const data = cancellation_range_list.map(({ text, value }) => ({ label: addUnit({ value: text }), value }));

    const onSave = () => {
        if (has_cancellation === is_enabled && selected_value === cancellation_duration) {
            closeActionSheet();
            return;
        }

        if (is_enabled && (has_take_profit || has_stop_loss)) {
            addSnackbar({
                message: getSnackBarText({
                    has_cancellation: is_enabled,
                    has_stop_loss,
                    has_take_profit,
                    switching_cancellation: true,
                }),
                hasCloseButton: true,
                delay: 100,
            });
        }
        // We should switch off TP and SL if DC is on and vice versa
        onChangeMultiple({
            has_cancellation: is_enabled,
            ...(is_enabled ? { has_take_profit: false, has_stop_loss: false } : {}),
            cancellation_duration: selected_value,
        });
        closeActionSheet();
    };

    return (
        <React.Fragment>
            <div className='deal-cancellation__container'>
                <div className='deal-cancellation__toggle'>
                    <Text>
                        <Localize i18n_default_text='Deal cancellation' />
                    </Text>
                    <ToggleSwitch checked={is_enabled} onChange={setIsEnabled} />
                </div>
                <div className='deal-cancellation__wheel-picker'>
                    {cancellation_range_list.length ? (
                        <WheelPicker
                            data={data}
                            disabled={!is_enabled}
                            selectedValue={selected_value}
                            setSelectedValue={
                                setSelectedValue as React.ComponentProps<typeof WheelPicker>['setSelectedValue']
                            }
                        />
                    ) : (
                        <Skeleton.Square />
                    )}
                </div>
            </div>
            <Button
                color='black-white'
                size='lg'
                label={<Localize i18n_default_text='Save' />}
                fullWidth
                className='risk-management__save-button'
                onClick={onSave}
            />
        </React.Fragment>
    );
});

export default DealCancellation;
