import React from 'react';
import classNames from 'classnames';
import ContentLoader from 'react-content-loader';
import { ProposalOpenContract } from '@deriv/api-types';
import { getContractTypeName } from '@deriv/bot-skeleton';
import { isDbotRTL } from '@deriv/bot-skeleton/src/utils/workspace';
import { Icon, IconTradeTypes, Money, Popover } from '@deriv/components';
import { convertDateFormat } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { popover_zindex } from 'Constants/z-indexes';
import { useDBotStore } from 'Stores/useDBotStore';

type TTransactionIconWithText = {
    icon: React.ReactElement;
    title: string;
    message?: React.ReactNode;
    className?: string;
};

type TPopoverItem = {
    icon?: React.ReactElement;
    title: string;
    children: React.ReactNode;
};

type TPopoverContent = {
    contract: ProposalOpenContract;
};

type TTransaction = {
    contract?: ProposalOpenContract;
};

const TransactionIconWithText = ({ icon, title, message, className }: TTransactionIconWithText) => (
    <React.Fragment>
        <Popover
            className={classNames(className, 'transactions__icon')}
            alignment={isDbotRTL() ? 'right' : 'left'}
            message={title}
            zIndex={popover_zindex.TRANSACTION.toString()}
        >
            {icon}
        </Popover>
        {message}
    </React.Fragment>
);

const TransactionFieldLoader = () => (
    <ContentLoader
        className='transactions__loader-text'
        height={10}
        width={80}
        speed={3}
        backgroundColor={'var(--general-section-2)'}
        foregroundColor={'var(--general-hover)'}
    >
        <rect x='0' y='0' rx='0' ry='0' width='100' height='12' />
    </ContentLoader>
);

const TransactionIconLoader = () => (
    <ContentLoader
        className='transactions__loader-icon'
        speed={3}
        width={24}
        height={24}
        backgroundColor={'var(--general-section-1)'}
        foregroundColor={'var(--general-hover)'}
    >
        <rect x='0' y='0' rx='5' ry='5' width='24' height='24' />
    </ContentLoader>
);

const PopoverItem = ({ icon, title, children }: TPopoverItem) => (
    <div className='transactions__popover-item'>
        {icon && <div className='transaction__popover-icon'>{icon}</div>}
        <div className='transactions__popover-details'>
            <div className='transactions__popover-title'>{title}</div>
            {children}
        </div>
    </div>
);

const PopoverContent = ({ contract }: TPopoverContent) => (
    <div className='transactions__popover-content'>
        {contract.transaction_ids && (
            <PopoverItem title={localize('Reference IDs')}>
                {contract.transaction_ids.buy && (
                    <div className='transactions__popover-value'>
                        {`${contract.transaction_ids.buy} ${localize('(Buy)')}`}
                    </div>
                )}
                {contract.transaction_ids.sell && (
                    <div className='transactions__popover-value'>
                        {`${contract.transaction_ids.sell} ${localize('(Sell)')}`}
                    </div>
                )}
            </PopoverItem>
        )}
        {contract.tick_count && (
            <PopoverItem title={localize('Duration')}>
                <div className='transactions__popover-value'>{`${contract.tick_count} ${localize('ticks')}`}</div>
            </PopoverItem>
        )}
        {(contract.barrier && (
            <PopoverItem title={localize('Barrier')}>
                <div className='transactions__popover-value'>{contract.barrier}</div>
            </PopoverItem>
        )) ||
            (contract.high_barrier && contract.low_barrier && (
                <PopoverItem title={localize('Barriers')}>
                    <div className='transactions__popover-value'>{`${contract.high_barrier} ${localize(
                        '(High)'
                    )}`}</div>
                    <div className='transactions__popover-value'>{`${contract.low_barrier} ${localize('(Low)')}`}</div>
                </PopoverItem>
            ))}
        {contract.date_start && (
            <PopoverItem title={localize('Start time')}>
                <div className='transactions__popover-value'>
                    {convertDateFormat(contract.date_start, 'YYYY-M-D HH:mm:ss [GMT]', 'YYYY-MM-DD HH:mm:ss [GMT]')}
                </div>
            </PopoverItem>
        )}
        {contract.entry_tick && (
            <PopoverItem title={localize('Entry spot')}>
                <div className='transactions__popover-value'>{contract.entry_tick}</div>
                {contract.entry_tick_time && (
                    <div className='transactions__popover-value'>
                        {convertDateFormat(
                            contract.entry_tick_time,
                            'YYYY-M-D HH:mm:ss [GMT]',
                            'YYYY-MM-DD HH:mm:ss [GMT]'
                        )}
                    </div>
                )}
            </PopoverItem>
        )}
        {(contract.exit_tick && contract.exit_tick_time && (
            <PopoverItem title={localize('Exit spot')}>
                <div className='transactions__popover-value'>{contract.exit_tick}</div>
                <div className='transactions__popover-value'>
                    {convertDateFormat(contract.exit_tick_time, 'YYYY-M-D HH:mm:ss [GMT]', 'YYYY-MM-DD HH:mm:ss [GMT]')}
                </div>
            </PopoverItem>
        )) ||
            (contract.exit_tick && (
                <PopoverItem title={localize('Exit time')}>
                    <div className='transactions__popover-value'>{contract.exit_tick}</div>
                </PopoverItem>
            ))}
    </div>
);

const Transaction = observer(({ contract }: TTransaction) => {
    const { transactions } = useDBotStore();
    const { active_transaction_id, setActiveTransactionId } = transactions;

    return (
        <Popover
            zIndex={popover_zindex.TRANSACTION.toString()}
            alignment={isDbotRTL() ? 'right' : 'left'}
            className='transactions__item-wrapper'
            is_open={contract && active_transaction_id === contract.transaction_ids.buy}
            message={contract && <PopoverContent contract={contract} />}
        >
            <div
                data-testid='dt_transactions_item'
                className='transactions__item'
                onClick={contract && (() => setActiveTransactionId(contract.transaction_ids.buy))}
            >
                <div className='transactions__cell transactions__trade-type'>
                    <div className='transactions__loader-container'>
                        {contract ? (
                            <TransactionIconWithText
                                icon={<Icon icon={`IcUnderlying${contract.underlying}`} size={16} />}
                                title={contract.display_name}
                            />
                        ) : (
                            <TransactionIconLoader />
                        )}
                    </div>
                    <div className='transactions__loader-container'>
                        {contract ? (
                            <TransactionIconWithText
                                icon={<IconTradeTypes type={contract.contract_type} size={16} />}
                                title={getContractTypeName(contract)}
                            />
                        ) : (
                            <TransactionIconLoader />
                        )}
                    </div>
                </div>
                <div className='transactions__cell transactions__entry-spot'>
                    <TransactionIconWithText
                        icon={<Icon icon='IcContractEntrySpot' />}
                        title={localize('Entry spot')}
                        message={contract?.entry_tick ?? <TransactionFieldLoader />}
                    />
                </div>
                <div className='transactions__cell transactions__exit-spot'>
                    <TransactionIconWithText
                        icon={<Icon icon='IcContractExitSpot' />}
                        title={localize('Exit spot')}
                        message={contract?.exit_tick ?? <TransactionFieldLoader />}
                    />
                </div>
                <div className='transactions__cell transactions__stake'>
                    {contract ? (
                        <Money amount={contract.buy_price} currency={contract.currency} show_currency />
                    ) : (
                        <TransactionFieldLoader />
                    )}
                </div>
                <div className='transactions__cell transactions__profit'>
                    {contract?.is_completed ? (
                        <div
                            className={classNames({
                                'transactions__profit--win': contract.profit >= 0,
                                'transactions__profit--loss': contract.profit < 0,
                            })}
                        >
                            <Money amount={Math.abs(contract.profit)} currency={contract.currency} show_currency />
                        </div>
                    ) : (
                        <TransactionFieldLoader />
                    )}
                </div>
            </div>
        </Popover>
    );
});

export default Transaction;
