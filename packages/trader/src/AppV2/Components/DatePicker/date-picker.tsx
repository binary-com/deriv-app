import React from 'react';
import { ActionSheet, DatePicker } from '@deriv-com/quill-ui';
import moment from 'moment';
import { toMoment } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { DEFAULT_DATE_FORMATTING_CONFIG } from 'AppV2/Utils/positions-utils';

type TDateRangePicker = {
    applyHandler: () => void;
    handleDateChange: (
        values: { to?: moment.Moment; from?: moment.Moment; is_batch?: boolean },
        otherParams?: {
            date_range?: Record<string, string | number>;
            shouldFilterContractTypes?: boolean;
        }
    ) => void;
    onClose: () => void;
    isOpen?: boolean;
    setCustomTimeRangeFilter: (newCustomTimeFilter?: string | undefined) => void;
};
const DateRangePicker = ({
    applyHandler,
    handleDateChange,
    onClose,
    isOpen,
    setCustomTimeRangeFilter,
}: TDateRangePicker) => {
    const [chosenRangeString, setChosenRangeString] = React.useState<string>();
    const [chosenRange, setChosenRange] = React.useState<(string | null | Date)[] | null | Date>([]);

    const onApply = () => {
        setCustomTimeRangeFilter(chosenRangeString);
        if (Array.isArray(chosenRange) && chosenRange.length) {
            handleDateChange(
                {
                    from: toMoment(chosenRange[0]),
                    to: chosenRange[1] ? toMoment(chosenRange[1]) : moment(chosenRange[0]).endOf('day'),
                },
                { shouldFilterContractTypes: true }
            );
        }
        applyHandler();
    };

    const onFormattedDate = (value: string) => {
        const trimmedValue = value.trim();
        const partialRange = trimmedValue.endsWith('-');
        setChosenRangeString(partialRange ? trimmedValue.substring(0, trimmedValue.length - 1) : trimmedValue);
    };

    return (
        <ActionSheet.Root isOpen={isOpen} onClose={onClose} position='left' expandable={false}>
            <ActionSheet.Portal shouldCloseOnDrag>
                <ActionSheet.Header title={<Localize i18n_default_text='Choose a date range' />} />
                <ActionSheet.Content>
                    <DatePicker
                        allowPartialRange
                        className='date-picker__action-sheet'
                        locale='en-GB'
                        selectRange
                        onFormattedDate={onFormattedDate}
                        onChange={setChosenRange}
                        optionsConfig={DEFAULT_DATE_FORMATTING_CONFIG}
                        tileDisabled={({ date }) => Date.parse(date.toDateString()) > Date.parse(toMoment().toString())}
                        maxDate={new Date()}
                    />
                </ActionSheet.Content>
                <ActionSheet.Footer
                    alignment='vertical'
                    isPrimaryButtonDisabled={!chosenRangeString}
                    primaryAction={{
                        content: <Localize i18n_default_text='Apply' />,
                        onAction: onApply,
                    }}
                />
            </ActionSheet.Portal>
        </ActionSheet.Root>
    );
};

export default DateRangePicker;
