import React from 'react';
import BarriersList from '../barriers-list';
import { Icon, MobileDialog, Text, Popover } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset';
import { Localize, localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { useDevice } from '@deriv/hooks';

const BarrierSelector = observer(() => {
    const { barrier_1, onChange, setHoveredBarrier, barrier_choices } = useTraderStore();
    const [is_barriers_table_expanded, setIsBarriersTableExpanded] = React.useState(false);
    const [selected_barrier, setSelectedBarrier] = React.useState(barrier_1);
    const { isMobile } = useDevice();

    const toggleBarriersTable = () => {
        setIsBarriersTableExpanded(!is_barriers_table_expanded);
    };

    const onBarrierClick = (barrier: string) => {
        setHoveredBarrier('');
        setSelectedBarrier(barrier);
        onChange({
            target: {
                name: 'barrier_1',
                value: barrier,
            },
        });
        setIsBarriersTableExpanded(false);
    };

    React.useEffect(() => {
        setSelectedBarrier(barrier_1);
    }, [barrier_1]);

    const header_tooltip_text = (
        <div className='trade-container__barriers-tooltip'>
            <Localize i18n_default_text='You receive a payout at expiry if the spot price never touches or breaches the barrier throughout the contract duration. Otherwise, your contract will be terminated early.' />
        </div>
    );

    const barriers_header_mobile = (
        <div className='trade-container__barriers-table__header-wrapper'>
            <div>{localize('Barriers')}</div>
            <Popover alignment='bottom' icon='info' zIndex='9999' message={header_tooltip_text} />
        </div>
    );

    if (isMobile) {
        return (
            <React.Fragment>
                <div className='mobile-widget' onClick={toggleBarriersTable}>
                    <Text size='xs' color='prominent' align='center'>
                        {localize('Spot')}
                    </Text>
                    <Text size='xs' color='prominent' align='center' weight='bold'>
                        {barrier_1}
                    </Text>
                    <Text size='xs' color='less-prominent' align='center'>
                        {localize('Barrier')}
                    </Text>
                </div>
                <MobileDialog
                    title={barriers_header_mobile}
                    onClose={toggleBarriersTable}
                    portal_element_id='modal_root'
                    wrapper_classname='contracts-modal-list'
                    visible={is_barriers_table_expanded}
                    header_classname='trade-container__barriers-table__header'
                >
                    <BarriersList
                        className='trade-container__barriers-table'
                        header={localize('Barriers')}
                        barriers_list={barrier_choices}
                        selected_item={selected_barrier}
                        show_table={is_barriers_table_expanded}
                        subheader={localize('Distance to current spot')}
                        onClick={onBarrierClick}
                        onClickCross={toggleBarriersTable}
                        onHover={setHoveredBarrier}
                    />
                </MobileDialog>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <Fieldset
                className='trade-container__fieldset trade-container__barriers'
                header={localize('Barrier')}
                header_tooltip={header_tooltip_text}
            >
                <div onClick={toggleBarriersTable} className='trade-container__barriers__wrapper'>
                    <Text size='xs' className='trade-container__barriers-spot'>
                        {localize('Spot')}
                    </Text>
                    <Text size='xs' className='trade-container__barriers-value' data-testid='current_barrier'>
                        {barrier_1}
                        <Icon icon='IcChevronLeft' className='trade-container__barriers-value--arrow-right' />
                    </Text>
                </div>
            </Fieldset>
            {is_barriers_table_expanded && (
                <BarriersList
                    className='trade-container__barriers-table'
                    header={localize('Barriers')}
                    barriers_list={barrier_choices}
                    selected_item={selected_barrier}
                    show_table={is_barriers_table_expanded}
                    subheader={localize('Distance to current spot')}
                    onClick={onBarrierClick}
                    onClickCross={toggleBarriersTable}
                    onHover={setHoveredBarrier}
                />
            )}
        </React.Fragment>
    );
});

export default BarrierSelector;
