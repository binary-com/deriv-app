import React from 'react';
import { useFormikContext } from 'formik';
import { Button, Text, ThemedScrollbars } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { rudderStackSendQsRunStrategyEvent } from '../../../../../analytics/rudderstack-quick-strategy';
import { TFormValues } from '../../types';
import StrategyTabContent from '../strategy-tab-content';
import useQsSubmitHandler from '../useQsSubmitHandler';
import '../../quick-strategy.scss';
import QSStepper from './qs-stepper';
import StrategyTemplatePicker from './strategy-template-picker';
import { STRATEGIES } from '../../config';
import classNames from 'classnames';
import { QsSteps } from './trade-constants';

type TMobileFormWrapper = {
    children: React.ReactNode;
    selected_trade_type: string;
    setSelectedTradeType: (selected_trade_type: string) => void;
    current_step: QsSteps;
    setCurrentStep: (current_step: QsSteps) => void;
};

const MobileFormWrapper = observer(
    ({ children, current_step, selected_trade_type, setCurrentStep, setSelectedTradeType }: TMobileFormWrapper) => {
        const { isValid, validateForm, values } = useFormikContext<TFormValues>();
        const { quick_strategy } = useDBotStore();
        const { selected_strategy } = quick_strategy;
        const { handleSubmit } = useQsSubmitHandler();
        const selected_startegy_label = STRATEGIES[selected_strategy as keyof typeof STRATEGIES].label;
        const is_verified_or_completed_step =
            current_step === QsSteps.StrategyVerified || current_step === QsSteps.StrategyCompleted;
        const is_selected_strategy_step = current_step === QsSteps.StrategySelect;

        React.useEffect(() => {
            validateForm();
        }, [selected_strategy, validateForm]);

        const onRun = () => {
            rudderStackSendQsRunStrategyEvent({
                form_values: values,
                selected_strategy,
            });
            handleSubmit();
        };

        const onBack = () => {
            setCurrentStep(QsSteps.StrategySelect);
        };

        React.useEffect(() => {
            if (isValid && current_step === QsSteps.StrategyVerified) {
                setCurrentStep(QsSteps.StrategyCompleted);
            }
            if (!isValid && current_step === QsSteps.StrategyCompleted) {
                setCurrentStep(QsSteps.StrategyVerified);
            }
        }, [isValid, current_step]);

        return (
            <div className='qs'>
                <div className='qs__body'>
                    <div className='qs__body__content'>
                        <ThemedScrollbars
                            className='qs__form__container qs__form__container--no-footer'
                            autohide={false}
                        >
                            <QSStepper
                                setCurrentStep={setCurrentStep}
                                current_step={current_step}
                                isValid={isValid}
                                is_mobile
                            />
                            {is_selected_strategy_step && (
                                <StrategyTemplatePicker
                                    setSelectedTradeType={setSelectedTradeType}
                                    setCurrentStep={setCurrentStep}
                                />
                            )}
                            {is_verified_or_completed_step && (
                                <>
                                    <div className='qs__selected-options'>
                                        <div className='qs__selected-options__item'>
                                            <Text size='xs'>{localize('Trade type')}</Text>
                                            <Text size='xs' weight='bold'>
                                                {selected_trade_type}
                                            </Text>
                                        </div>
                                        <div className='qs__selected-options__item'>
                                            <Text size='xs'>{localize('Strategy')}</Text>
                                            <Text size='xs' weight='bold'>
                                                {selected_startegy_label}
                                            </Text>
                                        </div>
                                    </div>
                                    <StrategyTabContent formfields={children} active_tab={'TRADE_PARAMETERS'} />
                                </>
                            )}
                        </ThemedScrollbars>
                        {is_verified_or_completed_step && (
                            <div
                                className={classNames(
                                    'qs__body__content__footer'
                                    // { 'qs__body__content__footer--mobile-fixed': current_step === QsSteps.StrategyVerified } // if we need fixed position
                                )}
                            >
                                <Button secondary disabled={is_selected_strategy_step} onClick={onBack}>
                                    {localize('Back')}
                                </Button>
                                <Button
                                    primary
                                    data-testid='qs-run-button'
                                    type='submit'
                                    onClick={e => {
                                        e.preventDefault();
                                        onRun();
                                    }}
                                    disabled={!isValid}
                                >
                                    {localize('Run')}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
);

export default MobileFormWrapper;
