import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import { LabelPairedChevronRightSmBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';

type TCustomDateFilterButton = {
    customTimeRangeFilter?: string;
    setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
};

const CustomDateFilterButton = ({ customTimeRangeFilter, setShowDatePicker }: TCustomDateFilterButton) => (
    <button className='custom-time-filter__wrapper' onClick={() => setShowDatePicker(true)}>
        <Text size='md' className='custom-time-filter__label'>
            <Localize i18n_default_text='Custom' />
        </Text>
        {customTimeRangeFilter && (
            <Text size='sm' color='quill-typography__color--subtle'>
                {customTimeRangeFilter}
            </Text>
        )}
        <LabelPairedChevronRightSmBoldIcon
            className='custom-time-filter__icon'
            fill='var(--component-textIcon-normal-default)'
        />
    </button>
);

export default CustomDateFilterButton;
