import React from 'react';
import { Text } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import QuickStrategyGuidesDetail from './quick-strategy-guides-details';
import './index.scss';

const QuickStrategyGuides = () => {
    const { ui } = useStore();
    const { is_desktop } = ui;
    const { dashboard } = useDBotStore();
    const { quick_strategy_tab_content } = dashboard;
    const [tutorial_selected_strategy, setTutorialSelectedStrategy] = React.useState('');

    return (
        <div className='tutorials-quick-strategy'>
            {tutorial_selected_strategy === '' && quick_strategy_tab_content.length > 0 && (
                <Text
                    className='tutorials-quick-strategy__title'
                    weight='bold'
                    color='prominent'
                    line_height='s'
                    size={is_desktop ? 's' : 'xs'}
                    as='div'
                >
                    {localize('Quick strategy guides')}
                </Text>
            )}
            <QuickStrategyGuidesDetail
                tutorial_selected_strategy={tutorial_selected_strategy}
                setTutorialSelectedStrategy={setTutorialSelectedStrategy}
                quick_strategy_tab_content={quick_strategy_tab_content}
            />
        </div>
    );
};

export default QuickStrategyGuides;
