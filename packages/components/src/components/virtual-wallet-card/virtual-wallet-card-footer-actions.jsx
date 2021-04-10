import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useHover } from '../../hooks/use-hover';
import Icon from '../icon';
import Text from '../text';

const VirtualWalletCardFooterActions = ({ getWalletLabels, onClickReset, onClickTransactions }) => {
    const [hover_ref_reset, is_reset_hovered] = useHover(null, true);
    const [hover_ref_transactions, is_transactions_hovered] = useHover(null, true);

    return (
        <div className='dc-virtual-wallet-card__actions-container'>
            <div className='dc-virtual-wallet-card__action' onClick={onClickReset} ref={hover_ref_reset}>
                <Icon
                    className={classNames({ 'dc-virtual-wallet-card__action--icon': is_reset_hovered })}
                    custom_color='var(--general-main-1)'
                    icon='IcAdd'
                    size={16}
                />
                {is_reset_hovered && (
                    <Text
                        className='dc-virtual-wallet-card__action--text'
                        color='colored-background'
                        line_height='m'
                        size='xxxs'
                    >
                        {getWalletLabels().RESET}
                    </Text>
                )}
            </div>
            <div className='dc-virtual-wallet-card__action' onClick={onClickTransactions} ref={hover_ref_transactions}>
                <Icon
                    className={classNames({ 'dc-virtual-wallet-card__action--icon': is_transactions_hovered })}
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
        </div>
    );
};

VirtualWalletCardFooterActions.propTypes = {
    getWalletLabels: PropTypes.func,
    onClickReset: PropTypes.func,
    onClickTransactions: PropTypes.func,
};

export default VirtualWalletCardFooterActions;
