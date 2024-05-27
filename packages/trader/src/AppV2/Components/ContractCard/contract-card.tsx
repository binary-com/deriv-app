import React from 'react';
import classNames from 'classnames';
import { CaptionText, Text } from '@deriv-com/quill-ui';
import { useSwipeable } from 'react-swipeable';
import { IconTradeTypes, Money } from '@deriv/components';
import {
    TContractInfo,
    getCardLabels,
    getCurrentTick,
    getMarketName,
    getTotalProfit,
    getTradeTypeName,
    isEnded,
    isHighLow,
    isMultiplierContract,
    isValidToCancel,
    isValidToSell,
} from '@deriv/shared';
import { ContractCardStatusTimer, TContractCardStatusTimerProps } from './contract-card-status-timer';
import { BinaryLink } from 'App/Components/Routes';
import { TClosedPosition } from 'AppV2/Containers/Positions/positions-content';
import { TRootStore } from 'Types';

type TContractCardProps = TContractCardStatusTimerProps & {
    className?: string;
    contractInfo: TContractInfo | TClosedPosition['contract_info'];
    currency?: string;
    hasActionButtons?: boolean;
    isSellRequested?: boolean;
    onClick?: (e?: React.MouseEvent<HTMLAnchorElement>) => void;
    onCancel?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    onClose?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    redirectTo?: string;
    serverTime?: TRootStore['common']['server_time'];
};

const DIRECTION = {
    LEFT: 'left',
    RIGHT: 'right',
};

const swipeConfig = {
    trackMouse: true,
    preventScrollOnSwipe: true,
};

const ContractCard = ({
    className,
    contractInfo,
    currency,
    hasActionButtons,
    isSellRequested,
    onCancel,
    onClick,
    onClose,
    redirectTo,
    serverTime,
}: TContractCardProps) => {
    const [isDeleted, setIsDeleted] = React.useState(false);
    const [shouldShowButtons, setShouldShowButtons] = React.useState(false);
    const { buy_price, contract_type, display_name, sell_time, shortcode } = contractInfo;
    const contract_main_title = getTradeTypeName(contract_type ?? '', {
        isHighLow: isHighLow({ shortcode }),
        showMainTitle: true,
    });
    const currentTick = 'tick_count' in contractInfo && contractInfo.tick_count ? getCurrentTick(contractInfo) : null;
    const tradeTypeName = `${contract_main_title} ${getTradeTypeName(contract_type ?? '', {
        isHighLow: isHighLow({ shortcode }),
    })}`.trim();
    const symbolName =
        'underlying_symbol' in contractInfo ? getMarketName(contractInfo.underlying_symbol ?? '') : display_name;
    const isMultiplier = isMultiplierContract(contract_type);
    const isSold = isEnded(contractInfo as TContractInfo);
    const totalProfit =
        (contractInfo as TClosedPosition['contract_info']).profit_loss ??
        (isMultiplierContract(contract_type)
            ? getTotalProfit(contractInfo as TContractInfo)
            : (contractInfo as TContractInfo).profit);
    const validToCancel = isValidToCancel(contractInfo as TContractInfo);
    const validToSell = isValidToSell(contractInfo as TContractInfo) && !isSellRequested;

    const handleSwipe = (direction: string) => {
        const isLeft = direction === DIRECTION.LEFT;
        setShouldShowButtons(isLeft);
    };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => handleSwipe(DIRECTION.LEFT),
        onSwipedRight: () => handleSwipe(DIRECTION.RIGHT),
        ...swipeConfig,
    });

    const handleClose = (e: React.MouseEvent<HTMLButtonElement>, shouldCancel?: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        shouldCancel ? onCancel?.(e) : onClose?.(e);
    };

    React.useEffect(() => {
        if (isSold && hasActionButtons) {
            setIsDeleted(true);
        }
    }, [isSold, hasActionButtons]);

    if (!contract_type) return null;
    return (
        <div className={classNames('contract-card-wrapper', { deleted: isDeleted })}>
            <BinaryLink
                {...(hasActionButtons ? swipeHandlers : {})}
                className={classNames('contract-card', className, {
                    'show-buttons': shouldShowButtons,
                    'has-cancel-button': validToCancel,
                    lost: Number(totalProfit) < 0,
                    won: Number(totalProfit) >= 0,
                })}
                onClick={onClick}
                onDragStart={e => e.preventDefault()}
                to={redirectTo}
            >
                <div className='body'>
                    <div className='details'>
                        <IconTradeTypes className='trade-type__icon' type={contract_type ?? ''} size={32} />
                        <div className='title'>
                            <Text className='trade-type' size='sm'>
                                {tradeTypeName}
                            </Text>
                            <CaptionText className='symbol' size='sm'>
                                {symbolName}
                            </CaptionText>
                        </div>
                        <CaptionText className='stake' size='sm'>
                            <Money amount={buy_price} currency={currency} show_currency />
                        </CaptionText>
                    </div>
                    <div className='status-and-profit'>
                        <ContractCardStatusTimer
                            currentTick={currentTick}
                            hasNoAutoExpiry={isMultiplier}
                            isSold={!!sell_time || isSold}
                            serverTime={serverTime}
                            {...contractInfo}
                        />
                        <Text className='total-profit' size='sm'>
                            <Money amount={totalProfit} currency={currency} has_sign show_currency />
                        </Text>
                    </div>
                </div>
                {hasActionButtons && (
                    <div className='buttons'>
                        {validToCancel && (
                            <button
                                className={classNames('icon', 'cancel', { loading: isSellRequested })}
                                aria-label='cancel'
                                disabled={Number(totalProfit) >= 0}
                                onClick={e => handleClose(e, true)}
                            >
                                <CaptionText bold as='div'>
                                    {isSellRequested ? <div className='circle-loader' /> : getCardLabels().CANCEL}
                                </CaptionText>
                            </button>
                        )}
                        <button
                            className={classNames('icon', 'close', { loading: isSellRequested })}
                            aria-label='close'
                            disabled={!validToSell}
                            onClick={handleClose}
                        >
                            <CaptionText bold as='div'>
                                {isSellRequested ? <div className='circle-loader' /> : getCardLabels().CLOSE}
                            </CaptionText>
                        </button>
                    </div>
                )}
            </BinaryLink>
        </div>
    );
};

export default ContractCard;
