import React from 'react';
import classNames from 'classnames';
import { Button, Icon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import ContractResultOverlay from 'Components/contract-result-overlay';
import { contract_stages } from 'Constants/contract-stage';
import { useDBotStore } from 'Stores/useDBotStore';
import { rudderStackSendRunBotEvent } from '../../analytics/rudderstack-common-events';
import CircularWrapper from './circular-wrapper';
import ContractStageText from './contract-stage-text';

type TTradeAnimation = {
    className?: string;
    should_show_overlay?: boolean;
};

const TradeAnimation = observer(({ className, should_show_overlay }: TTradeAnimation) => {
    const { run_panel, summary_card } = useDBotStore();
    const { client } = useStore();
    const { is_contract_completed, profit } = summary_card;
    const {
        contract_stage,
        is_stop_button_visible,
        is_stop_button_disabled,
        onRunButtonClick,
        onStopBotClick,
        performSelfExclusionCheck,
    } = run_panel;
    const { account_status } = client;
    const cashier_validation = account_status?.cashier_validation;
    const [shouldDisable, setShouldDisable] = React.useState(false);
    const is_unavailable_for_payment_agent = cashier_validation?.includes('WithdrawServiceUnavailableForPA');

    // perform self-exclusion checks which will be stored under the self-exclusion-store
    React.useEffect(() => {
        performSelfExclusionCheck();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (shouldDisable) {
            setTimeout(() => {
                setShouldDisable(false);
            }, 1000);
        }
    }, [shouldDisable]);

    const status_classes = ['', '', ''];
    const is_purchase_sent = contract_stage === (contract_stages.PURCHASE_SENT as unknown);
    const is_purchase_received = contract_stage === (contract_stages.PURCHASE_RECEIVED as unknown);

    let progress_status = contract_stage - (is_purchase_sent || is_purchase_received ? 2 : 3);

    if (progress_status >= 0) {
        if (progress_status < status_classes.length) {
            status_classes[progress_status] = 'active';
        }

        if (is_contract_completed) {
            progress_status += 1;
        }

        for (let i = 0; i < progress_status; i++) {
            status_classes[i] = 'completed';
        }
    }

    const is_disabled = is_stop_button_disabled || shouldDisable;

    const button_props = React.useMemo(() => {
        if (is_stop_button_visible) {
            return { id: 'db-animation__stop-button', text: localize('Stop'), icon: 'IcBotStop' };
        }
        return { id: 'db-animation__run-button', text: localize('Run'), icon: 'IcPlay' };
    }, [is_stop_button_visible]);
    const show_overlay = should_show_overlay && is_contract_completed;
    return (
        <div className={classNames('animation__wrapper', className)}>
            <Button
                is_disabled={is_disabled && !is_unavailable_for_payment_agent}
                className='animation__button'
                id={button_props.id}
                text={button_props.text}
                icon={<Icon icon={button_props.icon} color='active' />}
                onClick={() => {
                    setShouldDisable(true);
                    if (is_stop_button_visible) {
                        onStopBotClick();
                        return;
                    }
                    onRunButtonClick();
                    rudderStackSendRunBotEvent();
                }}
                has_effect
                {...(is_stop_button_visible || !is_unavailable_for_payment_agent ? { primary: true } : { green: true })}
            />
            <div
                className={classNames('animation__container', className, {
                    'animation--running': contract_stage > 0,
                    'animation--completed': show_overlay,
                })}
            >
                {show_overlay && <ContractResultOverlay profit={profit} />}
                <span className='animation__text'>
                    <ContractStageText contract_stage={contract_stage} />
                </span>
                <div className='animation__progress'>
                    <div className='animation__progress-line'>
                        <div className={`animation__progress-bar animation__progress-${contract_stage}`} />
                    </div>
                    {status_classes.map((status_class, i) => (
                        <CircularWrapper key={`status_class-${status_class}-${i}`} className={status_class} />
                    ))}
                </div>
            </div>
        </div>
    );
});

export default TradeAnimation;
