import React from 'react';
import clsx from 'clsx';
import { CaptionText, Text } from '@deriv-com/quill-ui';
import {
    TContractInfo,
    formatDate,
    formatTime,
    getCardLabels,
    getStartTime,
    hasForwardContractStarted,
    isEnded,
    isForwardStarting,
    toMoment,
} from '@deriv/shared';
import { TClosedPosition } from 'AppV2/Containers/Positions/positions-content';
import { Localize } from '@deriv/translations';
import { RemainingTime } from '@deriv/components';
import { TRootStore } from 'Types';
import { LabelPairedStopwatchMdBoldIcon } from '@deriv/quill-icons';

type TForwardStartingBannerProps = {
    class_name?: string;
    contract_info: TContractInfo | TClosedPosition['contract_info'];
    server_time?: TRootStore['common']['server_time'];
};

const ForwardStartingBanner = ({ class_name, contract_info, server_time }: TForwardStartingBannerProps) => {
    const { purchase_time, sell_time, shortcode } = contract_info;
    const is_sold = !!sell_time || isEnded(contract_info as TContractInfo);
    const is_forward_starting = isForwardStarting(shortcode ?? '', purchase_time);
    const start_time = getStartTime(shortcode ?? '');
    const has_forward_contract_started = hasForwardContractStarted(shortcode ?? '');
    const show_banner = is_forward_starting && !!start_time && !has_forward_contract_started && !is_sold;

    if (!show_banner) return null;

    return (
        <div className={clsx('banner__wrapper', class_name)}>
            <div className='banner__content--left'>
                <CaptionText size='sm' className='banner__text'>
                    <Localize i18n_default_text='This contract starts on' />
                </CaptionText>
                <CaptionText bold size='sm' className='banner__text'>
                    {formatDate(toMoment(parseInt(start_time || '')), 'DD MMM YYYY')}
                    {', '}
                    {formatTime(parseInt(start_time || ''), 'HH:mm [GMT]')}
                </CaptionText>
            </div>
            <Text bold size='md' className='banner__timer' as='div'>
                <LabelPairedStopwatchMdBoldIcon fill='var(--component-textIcon-static-prominentDark)' />
                <RemainingTime
                    as='span'
                    className='banner__timer__countdown'
                    end_time={parseInt(start_time || '')}
                    getCardLabels={getCardLabels}
                    start_time={server_time as moment.Moment}
                    key='remaining-time'
                />
            </Text>
        </div>
    );
};

export default ForwardStartingBanner;
