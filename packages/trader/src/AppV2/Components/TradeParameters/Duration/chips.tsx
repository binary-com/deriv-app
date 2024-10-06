import { Chip, Text } from '@deriv-com/quill-ui';
import { localize } from '@deriv/translations';
import React from 'react';

const DurationChips = ({
    duration_units_list,
    onChangeUnit,
    unit,
}: {
    duration_units_list: { text: string; value: string }[];
    onChangeUnit: (arg: string) => void;
    unit: string;
}) => {
    const list = duration_units_list.concat({ value: 'et', text: localize('End Time') });

    return (
        <div className='duration-container__chips'>
            {list.map((item, index) => (
                <Chip.Selectable
                    key={`${item.text}-${index}`}
                    selected={unit == item.value}
                    className='duration-container__chips__chip'
                    onClick={() => onChangeUnit(item.value)}
                >
                    <Text size='sm'>{item.text}</Text>
                </Chip.Selectable>
            ))}
        </div>
    );
};

export default DurationChips;
