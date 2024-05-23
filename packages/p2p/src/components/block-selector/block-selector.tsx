import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

type TBlockSelectorOptionProps = {
    is_selected?: boolean;
    name: string;
    value: number;
};
type TBlockSelectorProps = {
    label: string;
    onSelect: (value: number) => void;
    options: TBlockSelectorOptionProps[];
    tooltip_info: React.ReactNode;
    value: number;
};

const BlockSelector = ({ label, onSelect, options, tooltip_info, value }: TBlockSelectorProps) => {
    const [selectors, setSelectors] = React.useState(options);
    const [selected_value, setSelectedValue] = React.useState(value);
    const { showModal } = useModalManagerContext();
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

    React.useEffect(() => {
        onSelect(value);
    }, []);

    return (
        <div className='block-selector'>
            <div className='block-selector__label'>
                <Text color='less-prominent' size='xs' line_height='xl'>
                    <Localize i18n_default_text={label} />
                </Text>
                <Icon
                    color='disabled'
                    icon='IcInfoOutline'
                    onClick={() => {
                        showModal({
                            key: 'ErrorModal',
                            props: {
                                has_close_icon: false,
                                error_message: tooltip_info,
                                error_modal_title: localize(label),
                            },
                        });
                    }}
                />
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
