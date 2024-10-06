import React from 'react';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { Button, useSnackbar } from '@deriv-com/quill-ui';
import { localize, Localize } from '@deriv/translations';
import { WS } from '@deriv/shared';
import { getSnackBarText } from 'AppV2/Utils/trade-params-utils';
import TakeProfitAndStopLossInput from './take-profit-and-stop-loss-input';

type TTakeProfitAndStopLossContainerProps = {
    closeActionSheet: () => void;
    should_show_deal_cancellation?: boolean;
};

const TakeProfitAndStopLossContainer = observer(({ closeActionSheet }: TTakeProfitAndStopLossContainerProps) => {
    const {
        has_take_profit,
        has_cancellation,
        has_stop_loss,
        take_profit,
        onChangeMultiple,
        stop_loss,
        validation_errors,
    } = useTraderStore();

    const { addSnackbar } = useSnackbar();

    const [tp_error_text, setTPErrorText] = React.useState(validation_errors?.take_profit?.[0] ?? '');
    const tp_ref = React.useRef({ has_take_profit, take_profit, tp_error_text: validation_errors?.take_profit?.[0] });
    const is_api_response_tp_received_ref = React.useRef(false);

    const [sl_error_text, setSLErrorText] = React.useState(validation_errors?.stop_loss?.[0] ?? '');
    const sl_ref = React.useRef({ has_stop_loss, stop_loss, sl_error_text: validation_errors?.stop_loss?.[0] });
    const is_api_response_sl_received_ref = React.useRef(false);

    const onSave = () => {
        // Prevent from saving if user clicks before we got response from API
        if (!is_api_response_tp_received_ref.current && tp_ref.current.has_take_profit) return;
        if (!is_api_response_sl_received_ref.current && sl_ref.current.has_stop_loss) return;

        const {
            has_take_profit: has_take_profit_current,
            take_profit: take_profit_current,
            tp_error_text: tp_error_text_current,
        } = tp_ref.current;
        const {
            has_stop_loss: has_stop_loss_current,
            stop_loss: stop_loss_current,
            sl_error_text: sl_error_text_current,
        } = sl_ref.current;

        const is_tp_empty = take_profit_current === '' && has_take_profit_current;
        const is_sl_empty = stop_loss_current === '' && has_stop_loss_current;
        if (is_tp_empty) setTPErrorText(localize('Please enter a take profit amount.'));
        if (is_sl_empty) setSLErrorText(localize('Please enter a stop loss amount.'));
        if ((tp_error_text_current && has_take_profit_current) || (sl_error_text_current && has_stop_loss_current))
            return;
        if (is_sl_empty || is_tp_empty) return;

        // Show notification, that DC will be disabled if TP or SL is enabled
        const is_tp_enabled = tp_error_text_current ? false : has_take_profit_current;
        const is_sl_enabled = sl_error_text_current ? false : has_stop_loss_current;
        if ((is_tp_enabled || is_sl_enabled) && has_cancellation) {
            addSnackbar({
                message: getSnackBarText({
                    has_cancellation,
                    has_stop_loss: is_sl_enabled,
                    has_take_profit: is_tp_enabled,
                    switching_tp_sl: true,
                }),
                hasCloseButton: true,
                delay: 100,
            });
        }

        onChangeMultiple({
            has_take_profit: has_take_profit_current,
            take_profit: tp_error_text_current || take_profit_current === '0' ? '' : take_profit_current,
            has_stop_loss: has_stop_loss_current,
            stop_loss: sl_error_text_current || stop_loss_current === '0' ? '' : stop_loss_current,
            ...(is_tp_enabled || is_sl_enabled ? { has_cancellation: false } : {}),
        });

        closeActionSheet();
    };

    return (
        <div className='risk-management__tp-sl__wrapper'>
            <TakeProfitAndStopLossInput
                classname='risk-management__tp-sl'
                has_save_button={false}
                has_actionsheet_wrapper={false}
                initial_error_text={tp_error_text}
                onActionSheetClose={closeActionSheet}
                parent_ref={tp_ref}
                parent_is_api_response_received_ref={is_api_response_tp_received_ref}
            />
            <TakeProfitAndStopLossInput
                classname='risk-management__tp-sl'
                has_save_button={false}
                has_actionsheet_wrapper={false}
                initial_error_text={sl_error_text}
                onActionSheetClose={closeActionSheet}
                parent_ref={sl_ref}
                parent_is_api_response_received_ref={is_api_response_sl_received_ref}
                type='stop_loss'
            />
            <Button
                color='black-white'
                size='lg'
                label={<Localize i18n_default_text='Save' />}
                fullWidth
                className='risk-management__save-button'
                onClick={onSave}
            />
        </div>
    );
});

export default TakeProfitAndStopLossContainer;
