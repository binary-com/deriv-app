import React, { ReactElement } from 'react';
import classNames from 'classnames';
import ContentLoader from 'react-content-loader';
import { getContractTypeName } from '@deriv/bot-skeleton';
import { isDbotRTL } from '@deriv/bot-skeleton/src/utils/workspace';
import { Icon, IconTradeTypes, Popover } from '@deriv/components';
import { convertDateFormat } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { TTransaction } from './transaction-details.types';

const PARENT_CLASS = 'transaction-details-modal-mobile';

type TCardRow = {
    title: string;
    label: string | number | ReactElement;
    right_aligned: boolean;
    large_title: boolean;
    loader: boolean;
};

const CellLoader = () => (
    <ContentLoader
        className='transactions__loader-text'
        data-testid='transaction_details_card_cell_loader'
        height={10}
        width={80}
        speed={3}
        foregroundColor={'var(--general-section-2)'}
        backgroundColor={'var(--general-hover)'}
    >
        <rect x='0' y='0' rx='0' ry='0' width='100' height='12' />
    </ContentLoader>
);

const CardColumn = ({
    label = '',
    large_title = false,
    right_aligned = false,
    title = '',
    loader = false,
}: Partial<TCardRow>) => (
    <div
        className={classNames(`${PARENT_CLASS}__card__column`, {
            [`${PARENT_CLASS}__right-align`]: right_aligned,
        })}
    >
        {title && (
            <div
                className={classNames({
                    [`${PARENT_CLASS}__small-title`]: !large_title,
                    [`${PARENT_CLASS}__large-title`]: large_title,
                })}
            >
                {localize(title)}
            </div>
        )}
        <div className={`${PARENT_CLASS}__label`}>{loader ? <CellLoader /> : label}</div>
    </div>
);

const IconContainer = ({ message, icon }: { message: string; icon: ReactElement }) => (
    <div className={classNames(`${PARENT_CLASS}__table-cell`, `${PARENT_CLASS}__table-cell__icon-wrapper`)}>
        {message && (
            <Popover alignment={isDbotRTL() ? 'left' : 'right'} message={message} zIndex='7'>
                {icon}
            </Popover>
        )}
    </div>
);

export default function MobileTransactionCards({ transaction }: { transaction: TTransaction }) {
    return (
        <div className={`${PARENT_CLASS}__card`} data-testid='dt_mobile_transaction_card'>
            <div className={`${PARENT_CLASS}__card__row`}>
                <CardColumn
                    label={
                        <div className={`${PARENT_CLASS}__icon-wrapper`}>
                            <IconContainer
                                message={transaction?.display_name}
                                icon={<Icon icon={`IcUnderlying${transaction?.underlying}`} size={32} />}
                            />
                            <IconContainer
                                message={getContractTypeName(transaction)}
                                icon={<IconTradeTypes type={transaction?.contract_type} size={24} />}
                            />
                        </div>
                    }
                />
            </div>
            <div className={`${PARENT_CLASS}__card__row`}>
                <CardColumn title='Ref. ID' label={transaction?.transaction_ids?.buy} />
            </div>
            <div className={`${PARENT_CLASS}__card__row`}>
                <CardColumn
                    title='Timestamp'
                    label={convertDateFormat(
                        transaction?.date_start,
                        'YYYY-M-D HH:mm:ss [GMT]',
                        'YYYY-MM-DD HH:mm:ss [GMT]'
                    )}
                />
                <CardColumn
                    title='Entry Spot'
                    label={transaction?.entry_tick}
                    right_aligned
                    loader={!transaction.entry_tick}
                />
            </div>
            <div className={`${PARENT_CLASS}__card__row`}>
                <CardColumn title='Buy Price' label={Math.abs(transaction?.buy_price ?? 0).toFixed(2)} />
                <CardColumn
                    title='Exit Spot'
                    label={transaction?.exit_tick}
                    right_aligned
                    loader={!transaction.exit_tick}
                />
            </div>

            <div className={`${PARENT_CLASS}__card__row`}>
                <CardColumn title='Profit / Loss' large_title />
                <CardColumn
                    label={
                        <div
                            className={classNames({
                                [`${PARENT_CLASS}__card__profit--win`]: transaction?.profit > 0,
                                [`${PARENT_CLASS}__card__profit--loss`]: transaction?.profit < 0,
                            })}
                        >
                            {Math.abs(transaction?.profit ?? 0).toFixed(2)}
                        </div>
                    }
                    right_aligned
                    loader={!transaction.is_completed}
                />
            </div>
        </div>
    );
}
