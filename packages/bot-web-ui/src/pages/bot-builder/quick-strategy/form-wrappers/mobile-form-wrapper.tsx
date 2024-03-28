import React from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { Button, SelectNative, Text, ThemedScrollbars } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { STRATEGIES } from '../config';
import { TFormValues } from '../types';
import FormTabs from './form-tabs';
import StrategyTabContent from './strategy-tab-content';
import useQsSubmitHandler from './useQsSubmitHandler';
import '../quick-strategy.scss';

type TMobileFormWrapper = {
    children: React.ReactNode;
    active_tab_ref?: React.MutableRefObject<HTMLDivElement | null>;
};

const MobileFormWrapper: React.FC<TMobileFormWrapper> = observer(({ children, active_tab_ref }) => {
    const [active_tab, setActiveTab] = React.useState('TRADE_PARAMETERS');
    const { isValid, validateForm } = useFormikContext<TFormValues>();
    const { quick_strategy } = useDBotStore();
    const { selected_strategy, setSelectedStrategy } = quick_strategy;
    const { handleSubmit } = useQsSubmitHandler();
    const strategy = STRATEGIES[selected_strategy as keyof typeof STRATEGIES];

    React.useEffect(() => {
        validateForm();
    }, [selected_strategy]);

    const onChangeStrategy = (strategy: string) => {
        setSelectedStrategy(strategy);
        setActiveTab('TRADE_PARAMETERS');
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const onRun = () => {
        handleSubmit();
    };

    const dropdown_list = Object.keys(STRATEGIES).map(key => ({
        value: key,
        text: STRATEGIES[key as keyof typeof STRATEGIES].label,
        description: STRATEGIES[key as keyof typeof STRATEGIES].description,
    }));

    return (
        <div className='qs'>
            <div className='qs__body'>
                <div className='qs__body__content'>
                    <ThemedScrollbars
                        className={classNames('qs__form__container', {
                            'qs__form__container--no-footer': active_tab !== 'TRADE_PARAMETERS',
                        })}
                        autohide={false}
                    >
                        <div className='qs__body__content__title'>
                            <div className='qs__body__content__description'>
                                <Text size='xxs'>
                                    {localize('Choose a template below and set your trade parameters.')}
                                </Text>
                            </div>
                            <div className='qs__body__content__select'>
                                <SelectNative
                                    list_items={dropdown_list}
                                    value={selected_strategy}
                                    label={localize('Strategy')}
                                    should_show_empty_option={false}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        onChangeStrategy(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div ref={active_tab_ref}>
                            <FormTabs
                                active_tab={active_tab}
                                onChange={handleTabChange}
                                description={strategy?.description}
                            />
                        </div>
                        <StrategyTabContent formfields={children} active_tab={active_tab} />
                    </ThemedScrollbars>
                    {active_tab === 'TRADE_PARAMETERS' && (
                        <div className='qs__body__content__footer'>
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
});

export default MobileFormWrapper;
