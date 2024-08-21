import React from 'react';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { Button, useSnackbar } from '@deriv-com/quill-ui';
import { localize, Localize } from '@deriv/translations';
import { getSnackBarText } from 'AppV2/Utils/trade-params-utils';
import TakeProfitAndStopLossInput from './take-profit-and-stop-loss-input';
import { WS } from '@deriv/shared';

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

    const [tp_error_text, setTPErrorText] = React.useState(validation_errors.take_profit[0] ?? '');
    const tp_subscription_id_ref = React.useRef<string>();
    const tp_ref = React.useRef({ has_take_profit, take_profit, tp_error_text: validation_errors.take_profit[0] });

    const [sl_error_text, setSLErrorText] = React.useState(validation_errors.stop_loss[0] ?? '');
    const sl_subscription_id_ref = React.useRef<string>();
    const sl_ref = React.useRef({ has_stop_loss, stop_loss, sl_error_text: validation_errors.stop_loss[0] });

    const onSave = () => {
        WS.forget(tp_subscription_id_ref.current);
        WS.forget(sl_subscription_id_ref.current);

        const is_tp_empty = tp_ref.current.take_profit === '' && tp_ref.current.has_take_profit;
        const is_sl_empty = sl_ref.current.stop_loss === '' && sl_ref.current.has_stop_loss;
        if (is_tp_empty) setTPErrorText(localize('Please enter a take profit amount.'));
        if (is_sl_empty) setSLErrorText(localize('Please enter a stop loss amount.'));

        if (tp_ref.current.tp_error_text && tp_ref.current.has_take_profit) return;
        if (sl_ref.current.sl_error_text && sl_ref.current.has_stop_loss) return;
        if (is_sl_empty || is_tp_empty) return;

        // Show notification, that DC will be disabled if TP or SL is enabled
        const is_tp_enabled = tp_ref.current.tp_error_text ? false : tp_ref.current.has_take_profit;
        const is_sl_enabled = sl_ref.current.sl_error_text ? false : sl_ref.current.has_stop_loss;
        if ((is_tp_enabled || is_sl_enabled) && has_cancellation) {
            addSnackbar({
                message: getSnackBarText({
                    has_cancellation,
                    has_stop_loss: is_sl_enabled,
                    has_take_profit: is_tp_enabled,
                    switching_TP_SL: true,
                }),
                hasCloseButton: true,
                delay: 100,
            });
        }

        onChangeMultiple({
            has_take_profit: tp_ref.current.has_take_profit,
            take_profit:
                tp_ref.current.tp_error_text || tp_ref.current.take_profit === '0' ? '' : tp_ref.current.take_profit,
            has_stop_loss: sl_ref.current.has_stop_loss,
            stop_loss: sl_ref.current.sl_error_text || sl_ref.current.stop_loss === '0' ? '' : sl_ref.current.stop_loss,
            ...(is_tp_enabled || is_sl_enabled ? { has_cancellation: false } : {}),
        });

        closeActionSheet();
    };

    return (
        <div className='risk-management__tp-sl__wrapper'>
            <TakeProfitAndStopLossInput
                classname='risk-management__tp-sl'
                has_save_button={false}
                initial_error_text={tp_error_text}
                onActionSheetClose={closeActionSheet}
                parent_subscription_id_ref={tp_subscription_id_ref}
                parent_ref={tp_ref}
                should_wrap_with_actionsheet={false}
                key='take_profit'
            />
            <TakeProfitAndStopLossInput
                classname='risk-management__tp-sl'
                has_save_button={false}
                initial_error_text={sl_error_text}
                onActionSheetClose={closeActionSheet}
                parent_subscription_id_ref={sl_subscription_id_ref}
                parent_ref={sl_ref}
                type='stop_loss'
                should_wrap_with_actionsheet={false}
                key='stop_loss'
            />
            <Button
                color='black'
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
