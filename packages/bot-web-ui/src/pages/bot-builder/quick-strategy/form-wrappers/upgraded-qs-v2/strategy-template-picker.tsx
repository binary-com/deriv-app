import React from 'react';
import { LegacyGuide1pxIcon } from '@deriv/quill-icons';
import { observer } from '@deriv/stores';
import { Chip, SearchField } from '@deriv-com/quill-ui';
import { DBOT_TABS } from 'Constants/bot-contents';
import { useDBotStore } from 'Stores/useDBotStore';
import StrategyList from './strategy-list';
import { QsSteps, TRADE_TYPES } from './trade-constants';
import './strategy-template-picker.scss';

type TStrategyTemplatePicker = {
    setCurrentStep: (current_step: QsSteps) => void;
    setSelectedTradeType: (selected_trade_type: string) => void;
};

const StrategyTemplatePicker = observer(({ setCurrentStep, setSelectedTradeType }: TStrategyTemplatePicker) => {
    const { dashboard, quick_strategy } = useDBotStore();
    const { setActiveTabTutorial, setActiveTab, setFAQSearchValue, filterTuotrialTab } = dashboard;
    const { setFormVisibility, setSelectedStrategy } = quick_strategy;

    const [selector_chip_value, setSelectorChipValue] = React.useState(0);
    const [is_searching, setIsSearching] = React.useState(false);
    const [search_value, setSearchValue] = React.useState('');

    const handleChipSelect = (index: number) => {
        setSelectorChipValue(index);
    };

    const onSelectStrategy = (strategy: string, trade_type: string) => {
        setSelectedStrategy(strategy);
        setSelectedTradeType(trade_type);
        setCurrentStep(QsSteps.StrategyVerified);
    };

    return (
        <div className='strategy-template-picker'>
            <div className='strategy-template-picker__panel'>
                <SearchField
                    onChange={event => {
                        setSearchValue(event.target.value);
                        setIsSearching(true);
                        setFAQSearchValue(event.target.value);
                        filterTuotrialTab(event.target.value);
                    }}
                    placeholder='Search'
                    type='text'
                    value={search_value}
                    inputSize='sm'
                />
                <button
                    className='strategy-template-picker__icon'
                    onClick={() => {
                        setActiveTab(DBOT_TABS.TUTORIAL);
                        setActiveTabTutorial(3);
                        setFormVisibility(false);
                    }}
                >
                    <LegacyGuide1pxIcon iconSize='sm' />
                </button>
            </div>
            <div className='strategy-template-picker__chips'>
                {TRADE_TYPES.map((item, index) => (
                    <Chip.Selectable
                        key={index}
                        onClick={() => handleChipSelect(index)}
                        selected={index == selector_chip_value}
                        size='sm'
                        label={item}
                    />
                ))}
            </div>
            <StrategyList
                selector_chip_value={selector_chip_value}
                search_value={search_value}
                is_searching={is_searching}
                onSelectStrategy={onSelectStrategy}
            />
        </div>
    );
});

export default StrategyTemplatePicker;
