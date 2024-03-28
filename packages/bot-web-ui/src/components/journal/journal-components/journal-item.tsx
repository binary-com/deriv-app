import React from 'react';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { isDbotRTL } from '@deriv/bot-skeleton/src/utils/workspace';
import { MessageTypes } from '@deriv/bot-skeleton';
import { useNewRowTransition } from '@deriv/shared';
import { TJournalItemExtra, TJournalItemProps } from '../journal.types';
import DateItem from './date-item';
import FormatMessage from './format-message';

const getJournalItemContent = (
    message: string | ((value: () => void) => string),
    type: string,
    className: string,
    extra: TJournalItemExtra,
    measure: () => void
) => {
    switch (type) {
        case MessageTypes.SUCCESS: {
            return <FormatMessage logType={message as string} extra={extra} className={className} />;
        }
        case MessageTypes.NOTIFY: {
            if (typeof message === 'function') {
                return <div className={classnames('journal__text', className)}>{message(measure)}</div>;
            }
            return <div className={classnames('journal__text', className)}>{message}</div>;
        }
        case MessageTypes.ERROR: {
            return <div className='journal__text--error journal__text'>{message as string}</div>;
        }
        default:
            return null;
    }
};

const JournalItem = ({ row, is_new_row, measure }: TJournalItemProps) => {
    const { in_prop } = useNewRowTransition(is_new_row);
    const { date, time, message, message_type, className, extra } = row;
    const date_el = DateItem({ date, time });

    return (
        <CSSTransition in={in_prop} timeout={500} classNames='list__animation' data-testid='mock-css-transition'>
            <div className='journal__item' dir={isDbotRTL() ? 'rtl' : 'ltr'}>
                <div className='journal__item-content'>
                    {getJournalItemContent(message, message_type, className, extra as TJournalItemExtra, measure)}
                </div>
                <div className='journal__text-datetime'>{date_el}</div>
            </div>
        </CSSTransition>
    );
};

export default JournalItem;
