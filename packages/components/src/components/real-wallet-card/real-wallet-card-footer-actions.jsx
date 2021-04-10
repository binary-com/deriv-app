import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useHover } from '../../hooks/use-hover';
import Icon from '../icon';
import Text from '../text';

const RealWalletCardFooterActions = ({
    getWalletLabels,
    is_temporarily_unavailable,
    onClickDeposit,
    onClickSettings,
    onClickTransactions,
    onClickTransfer,
    onClickWithdrawal,
}) => {
    const [hover_ref_deposit, is_deposit_hovered] = useHover(null, true);
    const [hover_ref_settings, is_settings_settings] = useHover(null, true);
    const [hover_ref_transactions, is_transactions_hovered] = useHover(null, true);
    const [hover_ref_transfer, is_transfer_hovered] = useHover(null, true);
    const [hover_ref_withdrawal, is_withdrawal_hovered] = useHover(null, true);

    return (
        <div
            className={classNames('dc-real-wallet-card__actions-container', {
                'dc-real-wallet-card__actions-container--temporarily-unavailable': is_temporarily_unavailable,
            })}
        >
            <div className='dc-real-wallet-card__action' onClick={onClickDeposit} ref={hover_ref_deposit}>
                <Icon
                    className={classNames({ 'dc-real-wallet-card__action--icon': is_deposit_hovered })}
                    custom_color='var(--general-main-1)'
                    icon='IcAdd'
                    size={16}
                />
                {is_deposit_hovered && (
                    <Text
                        className='dc-real-wallet-card__action--text'
                        color='colored-background'
                        line_height='m'
                        size='xxxs'
                    >
                        {getWalletLabels().DEPOSIT}
                    </Text>
                )}
            </div>
            <div className='dc-real-wallet-card__action' onClick={onClickWithdrawal} ref={hover_ref_withdrawal}>
                <Icon
                    className={classNames({ 'dc-real-wallet-card__action--icon': is_withdrawal_hovered })}
                    custom_color='var(--general-main-1)'
                    icon='IcMinus'
                    size={16}
                />
                {is_withdrawal_hovered && (
                    <Text
                        className='dc-real-wallet-card__action--text'
                        color='colored-background'
                        line_height='m'
                        size='xxxs'
                    >
                        {getWalletLabels().WITHDRAWAL}
                    </Text>
                )}
            </div>
            <div className='dc-real-wallet-card__action' onClick={onClickTransfer} ref={hover_ref_transfer}>
                <Icon
                    className={classNames({ 'dc-real-wallet-card__action--icon': is_transfer_hovered })}
                    custom_color='var(--general-main-1)'
                    icon='IcAccountTransfer'
                    size={16}
                />
                {is_transfer_hovered && (
                    <Text
                        className='dc-real-wallet-card__action--text'
                        color='colored-background'
                        line_height='m'
                        size='xxxs'
                    >
                        {getWalletLabels().TRANSFER}
                    </Text>
                )}
            </div>
            <div className='dc-real-wallet-card__action' onClick={onClickTransactions} ref={hover_ref_transactions}>
                <Icon
                    className={classNames({ 'dc-real-wallet-card__action--icon': is_transactions_hovered })}
                    custom_color='var(--general-main-1)'
                    icon='IcTransactions'
                    size={16}
                />
                {is_transactions_hovered && (
                    <Text
                        className='dc-real-wallet-card__action--text'
                        color='colored-background'
                        line_height='m'
                        size='xxxs'
                    >
                        {getWalletLabels().TRANSACTIONS}
                    </Text>
                )}
            </div>
            <div className='dc-real-wallet-card__action' onClick={onClickSettings} ref={hover_ref_settings}>
                <Icon
                    className={classNames({ 'dc-real-wallet-card__action--icon': is_settings_settings })}
                    custom_color='var(--general-main-1)'
                    icon='IcGear'
                    size={16}
                />
                {is_settings_settings && (
                    <Text
                        className='dc-real-wallet-card__action--text'
                        color='colored-background'
                        line_height='m'
                        size='xxxs'
                    >
                        {getWalletLabels().SETTINGS}
                    </Text>
                )}
            </div>
        </div>
    );
};

RealWalletCardFooterActions.propTypes = {
    getWalletLabels: PropTypes.func,
    is_temporarily_unavailable: PropTypes.bool,
    onClickDeposit: PropTypes.func,
    onClickSettings: PropTypes.func,
    onClickTransactions: PropTypes.func,
    onClickTransfer: PropTypes.func,
    onClickWithdrawal: PropTypes.func,
};

export default RealWalletCardFooterActions;
