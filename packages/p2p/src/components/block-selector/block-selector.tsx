import React from 'react';
import classNames from 'classnames';
import { Icon, Popover, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';

type TBlockSelectorOptionProps = {
    is_selected?: boolean;
    name: string;
    value: number;
};
type TBlockSelectorProps = {
    label: string;
    onSelect: (value: number) => void;
    options: TBlockSelectorOptionProps[];
    tooltip_info: string;
    value: number;
};

const BlockSelector = ({ label, onSelect, options, tooltip_info, value }: TBlockSelectorProps) => {
    const [selectors, setSelectors] = React.useState(options);
    const [selected_value, setSelectedValue] = React.useState(value);
    const onClick = e => {
        const selected_value = e.target.getAttribute('data-value');
        onSelect?.(0);
        setSelectedValue(0);

        const updated_selectors = selectors.map(selector => {
            const is_selected = !selector.is_selected && selector.value == selected_value;

            if (is_selected) {
                onSelect?.(selector.value);
                setSelectedValue(selector.value);
            }

            return { ...selector, is_selected };
        });

        setSelectors(updated_selectors);
    };

    return (
        <div className='block-selector'>
            <div className='block-selector__label'>
                <Text color='less-prominent' size='xs' line_height='xl'>
                    <Localize i18n_default_text={label} />
                </Text>
                <Popover alignment='top' message={<Localize i18n_default_text={tooltip_info} />}>
                    <Icon color='disabled' icon='IcInfoOutline' />
                </Popover>
            </div>
            <div className='block-selector__options'>
                {selectors.map(option => (
                    <Text
                        as='div'
                        align='center'
                        color={option.value === selected_value ? 'colored-background' : 'less-prominent'}
                        data-value={option.value}
                        key={option.name}
                        onClick={onClick}
                        className={classNames('block-selector__option', {
                            'block-selector__option--selected': option.value === selected_value,
                        })}
                    >
                        {option.name}
                    </Text>
                ))}
            </div>
        </div>
    );
};

export default BlockSelector;
