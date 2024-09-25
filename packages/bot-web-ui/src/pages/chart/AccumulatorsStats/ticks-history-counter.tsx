import React from 'react';
import classNames from 'classnames';

type TTicksHistoryCounter = {
    has_progress_dots: boolean;
    progress_dots_testid?: string;
    should_emphasize_last_counter?: boolean;
    ticks_history_counter_testid?: string;
    value: number;
};

const TicksHistoryCounter = ({
    has_progress_dots,
    progress_dots_testid,
    should_emphasize_last_counter,
    ticks_history_counter_testid,
    value,
}: TTicksHistoryCounter) => {
    const should_highlight_last_counter = should_emphasize_last_counter && has_progress_dots && value === 0;
    return (
        <div
            data-testid={ticks_history_counter_testid}
            className={classNames('accumulators-stats__history-counter', {
                'accumulators-stats__history-counter--emphasized': should_highlight_last_counter,
            })}
        >
            {value}
            {has_progress_dots && (
                <div className='accumulators-stats__progress-dots' data-testid={progress_dots_testid}>
                    {[1, 2, 3].map(dot => {
                        return <span key={`ticks-dot-counter${dot}`} className={`dot-${dot}`} />;
                    })}
                </div>
            )}
        </div>
    );
};

export default React.memo(TicksHistoryCounter);
