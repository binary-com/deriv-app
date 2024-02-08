import React from 'react';
import InfoIcon from '@/assets/svgs/ic-info-outline.svg';
import { useUIContext } from '@/components';
import { useRegulationSwitcher } from '@/hooks';
import { RegulationModal } from '@/modals';
import { Provider } from '@deriv/library';
import { Tab, Tabs } from '@deriv-com/ui';

const RegulationSwitcherMobile = () => {
    const { show } = Provider.useModal();
    const { uiState } = useUIContext();

    const { buttons, handleButtonClick } = useRegulationSwitcher();

    const activeRegulation = uiState.regulation;

    return (
        <div className='flex items-center gap-400'>
            <InfoIcon className='h-auto w-800' onClick={() => show(<RegulationModal />)} />
            <Tabs
                activeTab={activeRegulation}
                className='flex rounded-300 p-200 w-[120px] h-2000'
                key={activeRegulation}
                onChange={index => handleButtonClick(buttons[index].label)}
                variant='secondary'
            >
                {buttons.map(button => (
                    <Tab className='rounded-200' key={button.label} title={button.label} />
                ))}
            </Tabs>
        </div>
    );
};

export default RegulationSwitcherMobile;
