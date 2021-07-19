import { Button, Dialog, Drawer, Modal, Money, Tabs, ThemedScrollbars, Text } from '@deriv/components';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { localize, Localize } from '@deriv/translations';
import Journal from 'Components/journal';
import Summary from 'Components/summary';
import Transactions from 'Components/transactions';
import TradeAnimation from 'Components/trade-animation';
import SelfExclusion from 'Components/self-exclusion';
import { popover_zindex } from 'Constants/z-indexes';
import { connect } from 'Stores/connect';

const StatisticsTile = ({ content, contentClassName, title }) => (
    <div className='run-panel__tile'>
        <div className='run-panel__tile-title'>{title}</div>
        <div className={classNames('run-panel__tile-content', contentClassName)}>{content}</div>
    </div>
);

const StatisticsSummary = ({
    currency,
    is_mobile,
    lost_contracts,
    number_of_runs,
    total_stake,
    total_payout,
    toggleStatisticsInfoModal,
    total_profit,
    won_contracts,
}) => (
    <div
        className={classNames('run-panel__stat', {
            'run-panel__stat--mobile': is_mobile,
        })}
    >
        <div className='run-panel__stat--info' onClick={toggleStatisticsInfoModal}>
            <div className='run-panel__stat--info-item'>
                <Localize i18n_default_text="What's this?" />
            </div>
        </div>
        <div className='run-panel__stat--tiles'>
            <StatisticsTile
                title={localize('Total stake')}
                alignment='top'
                content={<Money amount={total_stake} currency={currency} show_currency />}
            />
            <StatisticsTile
                title={localize('Total payout')}
                alignment='top'
                content={<Money amount={total_payout} currency={currency} show_currency />}
            />
            <StatisticsTile title={localize('No. of runs')} alignment='top' content={number_of_runs} />
            <StatisticsTile title={localize('Contracts lost')} alignment='bottom' content={lost_contracts} />
            <StatisticsTile title={localize('Contracts won')} alignment='bottom' content={won_contracts} />
            <StatisticsTile
                title={localize('Profit/loss')}
                content={<Money amount={total_profit} currency={currency} has_sign show_currency />}
                alignment='bottom'
                contentClassName={classNames('run-panel__stat-amount', {
                    'run-panel__stat-amount--positive': total_profit > 0,
                    'run-panel__stat-amount--negative': total_profit < 0,
                })}
            />
        </div>
    </div>
);

const DrawerHeader = ({ is_clear_stat_disabled, is_mobile, is_drawer_open, onClearStatClick }) =>
    is_mobile &&
    is_drawer_open && (
        <Button
            id='db-run-panel__clear-button'
            className='run-panel__clear-button'
            is_disabled={is_clear_stat_disabled}
            text={localize('Reset')}
            onClick={onClearStatClick}
            secondary
        />
    );

const DrawerContent = ({ active_index, is_drawer_open, setActiveTabIndex, ...props }) => {
    return (
        <>
            <Tabs active_index={active_index} onTabItemClick={setActiveTabIndex} top>
                <div id='db-run-panel-tab__summary' label={localize('Summary')}>
                    <Summary is_drawer_open={is_drawer_open} />
                </div>
                <div id='db-run-panel-tab__transactions' label={localize('Transactions')}>
                    <Transactions is_drawer_open={is_drawer_open} />
                </div>
                <div id='db-run-panel-tab__journal' label={localize('Journal')}>
                    <Journal is_drawer_open={is_drawer_open} />
                </div>
            </Tabs>
            {is_drawer_open && active_index !== 2 && <StatisticsSummary {...props} />}
        </>
    );
};

const DrawerFooter = ({ is_clear_stat_disabled, onClearStatClick }) => (
    <div className='run-panel__footer'>
        <Button
            id='db-run-panel__clear-button'
            className='run-panel__footer-button'
            is_disabled={is_clear_stat_disabled}
            text={localize('Reset')}
            onClick={onClearStatClick}
            has_effect
            secondary
        />
    </div>
);

const MobileDrawerFooter = () => {
    return (
        <div className='controls__section'>
            <div className='controls__buttons'>
                <TradeAnimation className='controls__animation' should_show_overlay info_direction={'right'} />
            </div>
        </div>
    );
};

const StatisticsInfoModal = ({ is_mobile, is_statistics_info_modal_open, toggleStatisticsInfoModal }) => {
    return (
        <Modal
            className={classNames('statistics__modal', { 'statistics__modal--mobile': is_mobile })}
            title={localize("What's this?")}
            is_open={is_statistics_info_modal_open}
            toggleModal={toggleStatisticsInfoModal}
            width={'440px'}
        >
            <Modal.Body>
                <div className={classNames('statistics__modal-body', { 'statistics__modal-body--mobile': is_mobile })}>
                    <ThemedScrollbars className='statistics__modal-scrollbar'>
                        <Text as='p' weight='bold' className='statistics__modal-body--content no-margin'>
                            {localize('Total stake')}
                        </Text>
                        <Text as='p'>{localize('Total stake since you last cleared your stats.')}</Text>
                        <Text as='p' weight='bold' className='statistics__modal-body--content'>
                            {localize('Total payout')}
                        </Text>
                        <Text as='p'>{localize('Total payout since you last cleared your stats.')}</Text>
                        <Text as='p' weight='bold' className='statistics__modal-body--content'>
                            {localize('No. of runs')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The number of times your bot has run since you last cleared your stats. Each run includes the execution of all the root blocks.'
                            )}
                        </Text>
                        <Text as='p' weight='bold' className='statistics__modal-body--content'>
                            {localize('Contracts lost')}
                        </Text>
                        <Text as='p'>
                            {localize('The number of contracts you have lost since you last cleared your stats.')}
                        </Text>
                        <Text as='p' weight='bold' className='statistics__modal-body--content'>
                            {localize('Contracts won')}
                        </Text>
                        <Text as='p'>
                            {localize('The number of contracts you have won since you last cleared your stats.')}
                        </Text>
                        <Text as='p' weight='bold' className='statistics__modal-body--content'>
                            {localize('Profit/loss')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'Your total profit/loss since you last cleared your stats. It is the difference between your total payout and your total stake.'
                            )}
                        </Text>
                    </ThemedScrollbars>
                </div>
            </Modal.Body>
        </Modal>
    );
};

const RunPanel = ({
    active_index,
    currency,
    dialog_options,
    is_clear_stat_disabled,
    is_dialog_open,
    is_drawer_open,
    is_mobile,
    is_statistics_info_modal_open,
    lost_contracts,
    number_of_runs,
    onCancelButtonClick,
    onClearStatClick,
    onCloseDialog,
    onMount,
    onOkButtonClick,
    onRunButtonClick,
    onUnmount,
    setActiveTabIndex,
    toggleDrawer,
    toggleStatisticsInfoModal,
    total_payout,
    total_profit,
    total_stake,
    won_contracts,
}) => {
    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, [onMount, onUnmount]);

    const content = (
        <DrawerContent
            active_index={active_index}
            currency={currency}
            is_drawer_open={is_drawer_open}
            is_mobile={is_mobile}
            lost_contracts={lost_contracts}
            number_of_runs={number_of_runs}
            setActiveTabIndex={setActiveTabIndex}
            toggleStatisticsInfoModal={toggleStatisticsInfoModal}
            total_payout={total_payout}
            total_profit={total_profit}
            total_stake={total_stake}
            won_contracts={won_contracts}
        />
    );

    const footer = <DrawerFooter is_clear_stat_disabled={is_clear_stat_disabled} onClearStatClick={onClearStatClick} />;

    const header = (
        <DrawerHeader
            is_clear_stat_disabled={is_clear_stat_disabled}
            is_mobile={is_mobile}
            is_drawer_open={is_drawer_open}
            onClearStatClick={onClearStatClick}
        />
    );

    return (
        <>
            <div className={is_mobile && is_drawer_open ? 'run-panel__container--mobile' : undefined}>
                <Drawer
                    anchor='right'
                    className={!is_mobile ? 'run-panel__container' : undefined}
                    contentClassName='run-panel__content'
                    header={header}
                    footer={!is_mobile && footer}
                    is_open={is_drawer_open}
                    toggleDrawer={toggleDrawer}
                    width={366}
                    zIndex={popover_zindex.RUN_PANEL}
                >
                    {content}
                </Drawer>
                {is_mobile && <MobileDrawerFooter />}
            </div>
            <Dialog
                title={dialog_options.title}
                is_visible={is_dialog_open}
                cancel_button_text={dialog_options.cancel_button_text || localize('Cancel')}
                onCancel={onCancelButtonClick}
                confirm_button_text={dialog_options.ok_button_text || localize('OK')}
                onConfirm={onOkButtonClick || onCloseDialog}
                is_mobile_full_width={false}
                className={'dc-dialog__wrapper--fixed'}
                has_close_icon
                onClose={onCloseDialog}
            >
                {dialog_options.message}
            </Dialog>
            <SelfExclusion onRunButtonClick={onRunButtonClick} />
            <StatisticsInfoModal
                is_mobile={is_mobile}
                is_statistics_info_modal_open={is_statistics_info_modal_open}
                toggleStatisticsInfoModal={toggleStatisticsInfoModal}
            />
        </>
    );
};

RunPanel.propTypes = {
    active_index: PropTypes.number,
    currency: PropTypes.string,
    dialog_options: PropTypes.object,
    is_clear_stat_disabled: PropTypes.bool,
    is_dialog_open: PropTypes.bool,
    is_drawer_open: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_statistics_info_modal_open: PropTypes.bool,
    lost_contracts: PropTypes.number,
    number_of_runs: PropTypes.number,
    onCancelButtonClick: PropTypes.func,
    onClearStatClick: PropTypes.func,
    onCloseDialog: PropTypes.func,
    onMount: PropTypes.func,
    onOkButtonClick: PropTypes.func,
    onRunButtonClick: PropTypes.func,
    onUnmount: PropTypes.func,
    setActiveTabIndex: PropTypes.func,
    toggleDrawer: PropTypes.func,
    toggleStatisticsInfoModal: PropTypes.func,
    total_payout: PropTypes.number,
    total_profit: PropTypes.number,
    total_stake: PropTypes.number,
    won_contracts: PropTypes.number,
};

export default connect(({ run_panel, core, ui }) => ({
    active_index: run_panel.active_index,
    currency: core.client.currency,
    dialog_options: run_panel.dialog_options,
    is_clear_stat_disabled: run_panel.is_clear_stat_disabled,
    is_dialog_open: run_panel.is_dialog_open,
    is_drawer_open: run_panel.is_drawer_open,
    is_mobile: ui.is_mobile,
    is_statistics_info_modal_open: run_panel.is_statistics_info_modal_open,
    lost_contracts: run_panel.statistics.lost_contracts,
    number_of_runs: run_panel.statistics.number_of_runs,
    onCancelButtonClick: run_panel.onCancelButtonClick,
    onClearStatClick: run_panel.onClearStatClick,
    onCloseDialog: run_panel.onCloseDialog,
    onMount: run_panel.onMount,
    onOkButtonClick: run_panel.onOkButtonClick,
    onRunButtonClick: run_panel.onRunButtonClick,
    onUnmount: run_panel.onUnmount,
    setActiveTabIndex: run_panel.setActiveTabIndex,
    toggleDrawer: run_panel.toggleDrawer,
    toggleStatisticsInfoModal: run_panel.toggleStatisticsInfoModal,
    total_payout: run_panel.statistics.total_payout,
    total_profit: run_panel.statistics.total_profit,
    total_stake: run_panel.statistics.total_stake,
    won_contracts: run_panel.statistics.won_contracts,
}))(RunPanel);
