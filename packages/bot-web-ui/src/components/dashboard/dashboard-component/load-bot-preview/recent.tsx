import { MobileWrapper, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import React from 'react';
import { useDBotStore } from 'Stores/useDBotStore';
import DeleteDialog from './delete-dialog';
import './index.scss';
import RecentWorkspace from './recent-workspace';
import { isMobile } from '@deriv/shared';
import SaveModal from '../../../save-modal';
import classNames from 'classnames';

const HEADERS = ['Bot name', 'Last modified', 'Status'];

const RecentComponent = observer(() => {
    const { load_modal, dashboard } = useDBotStore();
    const { dashboard_strategies, setDashboardStrategies } = load_modal;
    const { setStrategySaveType, strategy_save_type } = dashboard;

    React.useEffect(() => {
        setStrategySaveType('');
        //this dependency is used when we use the save modal popup
    }, [strategy_save_type]);

    const is_mobile = isMobile();

    if (!dashboard_strategies?.length) return null;
    return (
        <div className='load-strategy__container load-strategy__container--has-footer'>
            <div className='load-strategy__recent'>
                <div className='load-strategy__recent__files'>
                    <div className='load-strategy__title'>
                        <Text size={is_mobile ? 'xs' : 's'} weight='bold'>
                            <Localize i18n_default_text='Your bots' />
                        </Text>
                    </div>
                    <div className='load-strategy__recent__files__list'>
                        <div
                            className={classNames('load-strategy__recent-item load-strategy__recent-item__loaded', {
                                'load-strategy__recent-item__loaded--first-child': !is_mobile,
                            })}
                        >
                            {HEADERS.map(tab_name => {
                                return (
                                    <Text size='xs' weight='bold' key={tab_name}>
                                        {tab_name}
                                    </Text>
                                );
                            })}
                        </div>
                        {dashboard_strategies.map((workspace, index) => {
                            return <RecentWorkspace key={workspace.id} workspace={workspace} index={index} />;
                        })}
                    </div>
                    <DeleteDialog setStrategies={setDashboardStrategies} />
                    <MobileWrapper>
                        <SaveModal />
                    </MobileWrapper>
                </div>
            </div>
        </div>
    );
});

export default RecentComponent;
