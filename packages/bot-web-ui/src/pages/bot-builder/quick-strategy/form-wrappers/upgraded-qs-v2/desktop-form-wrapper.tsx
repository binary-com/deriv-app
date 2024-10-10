import { Button, Text, ThemedScrollbars } from '@deriv/components';
import Icon from '@deriv/components/src/components/icon/icon';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useFormikContext } from 'formik';
import React from 'react';
import { useDBotStore } from 'Stores/useDBotStore';
import { rudderStackSendQsEditStrategyEvent } from '../../../../../analytics/rudderstack-quick-strategy';
import { STRATEGIES } from '../../config';
import '../../quick-strategy.scss';
import { TFormData, TFormValues } from '../../types';
import StrategyTabContent from '../strategy-tab-content';
import useQsSubmitHandler from '../useQsSubmitHandler';
import QSStepper from './qs-stepper';
import StrategyTemplatePicker from './strategy-template-picker';
import { QsSteps } from './trade-constants';

type TDesktopFormWrapper = {
    children: React.ReactNode;
    current_step: QsSteps;
    setCurrentStep: (current_step: QsSteps) => void;
    onClickClose: () => void;
    selected_trade_type: string;
    setSelectedTradeType: (selected_trade_type: string) => void;
};

const QuickSelectionPanel = ({
    selected_trade_type,
    selected_startegy_label,
    children,
}: Pick<TDesktopFormWrapper, 'selected_trade_type' | 'children'> & { selected_startegy_label: string }) => (
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
);

const FormWrapper = observer(
    ({
        children,
        current_step,
        setCurrentStep,
        onClickClose,
        selected_trade_type,
        setSelectedTradeType,
    }: TDesktopFormWrapper) => {
        const scroll_ref = React.useRef<HTMLDivElement & SVGSVGElement>(null);
        const { submitForm, isValid, setFieldValue, validateForm, values } = useFormikContext<TFormValues>();
        const { quick_strategy } = useDBotStore();
        const { selected_strategy, onSubmit, is_stop_bot_dialog_open } = quick_strategy;
        const { handleSubmit } = useQsSubmitHandler();

        const selected_startegy_label = STRATEGIES[selected_strategy as keyof typeof STRATEGIES].label;
        const is_selected_strategy_step = current_step === QsSteps.StrategySelect;

        React.useEffect(() => {
            if (isValid && current_step === QsSteps.StrategyVerified) {
                setCurrentStep(QsSteps.StrategyCompleted);
            }
            if (!isValid && current_step === QsSteps.StrategyCompleted) {
                setCurrentStep(QsSteps.StrategyVerified);
            }
        }, [isValid, current_step]);

        React.useEffect(() => {
            validateForm();
        }, [selected_strategy, validateForm]);

        const onEdit = async () => {
            await setFieldValue('action', 'EDIT');
            validateForm();
            submitForm().then((form_data: TFormData | void) => {
                if (isValid && form_data) {
                    rudderStackSendQsEditStrategyEvent({
                        form_values: values,
                        selected_strategy,
                    });
                    onSubmit(form_data); // true to load and run the bot
                }
            });
        };

        const onRun = () => {
            handleSubmit();
        };

        const onBack = () => {
            setCurrentStep(QsSteps.StrategySelect);
        };

        const renderContent = React.useCallback(() => {
            switch (current_step) {
                case QsSteps.StrategySelect:
                    return (
                        <StrategyTemplatePicker
                            setCurrentStep={setCurrentStep}
                            setSelectedTradeType={setSelectedTradeType}
                        />
                    );
                case QsSteps.StrategyVerified:
                    return (
                        <QuickSelectionPanel
                            selected_trade_type={selected_trade_type}
                            selected_startegy_label={selected_startegy_label}
                        >
                            {children}
                        </QuickSelectionPanel>
                    );
                case QsSteps.StrategyCompleted:
                    return (
                        <QuickSelectionPanel
                            selected_trade_type={selected_trade_type}
                            selected_startegy_label={selected_startegy_label}
                        >
                            {children}
                        </QuickSelectionPanel>
                    );
                default:
                    return null;
            }
        }, [
            current_step,
            selected_trade_type,
            selected_startegy_label,
            children,
            setCurrentStep,
            setSelectedTradeType,
        ]);

        return (
            !is_stop_bot_dialog_open && (
                <div className='qs'>
                    <div className='qs__head'>
                        <div className='qs__head__title'>
                            <Text weight='bold'>{localize('Quick Strategy')}</Text>
                        </div>
                        <div className='qs__head__action'>
                            <span
                                data-testid='qs-desktop-close-button'
                                onClick={onClickClose}
                                tabIndex={0}
                                onKeyDown={(e: React.KeyboardEvent) => {
                                    if (e.key === 'Enter') {
                                        onClickClose();
                                    }
                                }}
                            >
                                <Icon icon='IcCross' />
                            </span>
                        </div>
                    </div>
                    <div className='qs__body'>
                        <div className='qs__body__sidebar'>
                            <div className='qs__body__sidebar__subtitle'>
                                <Text size='xs'>
                                    {localize('Choose a template below and set your trade parameters.')}
                                </Text>
                            </div>
                            <QSStepper current_step={current_step} />
                        </div>
                        <div className='qs__body__content'>
                            <ThemedScrollbars
                                className='qs__form__container qs__form__container--no-footer'
                                autohide={false}
                                refSetter={scroll_ref}
                            >
                                {renderContent()}
                            </ThemedScrollbars>
                            {!is_selected_strategy_step && (
                                <div className='qs__body__content__footer'>
                                    <Button transparent disabled={is_selected_strategy_step} onClick={onBack}>
                                        {localize('Back')}
                                    </Button>
                                    <Button secondary disabled={!isValid} onClick={onEdit}>
                                        {localize('Edit')}
                                    </Button>
                                    <Button
                                        data-testid='qs-run-button'
                                        primary
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
            )
        );
    }
);

export default React.memo(FormWrapper);
