import React from 'react';
import { observer } from 'mobx-react';
import { MobileOrTabletWrapper, Money, SwipeableNotification, Text } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { getCardLabels, getContractPath } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

const TradeNotifications = observer(({ show_trade_notifications }: { show_trade_notifications?: boolean }) => {
    const {
        notifications: { removeTradeNotifications, trade_notifications },
    } = useStore();
    if (!show_trade_notifications || !trade_notifications.length) return null;

    return (
        <MobileOrTabletWrapper>
            <div className='trade-notifications'>
                {trade_notifications.slice(0, 3).map(notification => {
                    const { buy_price, contract_id, currency, contract_type, id, profit, symbol, status, timestamp } =
                        notification;
                    const is_open = status === 'open';
                    return (
                        <SwipeableNotification
                            key={id}
                            is_failure={!is_open && profit < 0}
                            is_success={!is_open && profit >= 0}
                            onUnmount={() => removeTradeNotifications(id)}
                            redirect_to={getContractPath(contract_id)}
                            timestamp={is_open ? null : timestamp}
                            visibility_duration_ms={3000}
                        >
                            <Text as='p' size='xxxs' line_height='s'>
                                <Localize
                                    i18n_default_text='<0>{{title}}:</0> {{trade_type_name}} on {{symbol}}'
                                    components={[<strong key={0} />]}
                                    values={{
                                        symbol,
                                        title: is_open ? localize('Trade opened') : localize('Trade closed'),
                                        trade_type_name: contract_type,
                                    }}
                                    shouldUnescape
                                />
                            </Text>
                            <Text as='p' size='xxxs' line_height='s'>
                                {is_open ? getCardLabels().STAKE : getCardLabels().TOTAL_PROFIT_LOSS}{' '}
                                <Text size='xxxs' line_height='s' weight='bold'>
                                    <Money
                                        amount={is_open ? buy_price : profit}
                                        currency={currency}
                                        has_sign={!is_open}
                                        should_format
                                        show_currency
                                    />
                                </Text>
                            </Text>
                        </SwipeableNotification>
                    );
                })}
            </div>
        </MobileOrTabletWrapper>
    );
});

export default TradeNotifications;
