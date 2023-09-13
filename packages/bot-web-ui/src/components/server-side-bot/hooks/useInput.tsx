import React from 'react';
import { Icon, Input, Popover } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { popover_zindex } from 'Constants/z-indexes';

type TUseInput = {
    label: string;
    trailing_icon_message?: string;
    zIndex?: number;
    type: string;
    dispatch?: React.Dispatch<any>;
};

const useInput = ({ label, trailing_icon_message, type, dispatch }: TUseInput) => {
    const [value, setValue] = React.useState('');
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setValue(value);
        if (dispatch) {
            dispatch({ name: label, value });
        }
    };
    const reset_value = () => setValue('');
    const is_mobile = isMobile();
    return [
        <Input
            key={`input-${label}`}
            type={type}
            label={label}
            value-={value}
            onChange={onChange}
            trailing_icon={
                <Popover
                    alignment={is_mobile ? 'top' : 'bottom'}
                    message={trailing_icon_message}
                    zIndex={String(popover_zindex.QUICK_STRATEGY)}
                >
                    <Icon icon='IcInfoOutline' />
                </Popover>
            }
        />,
        reset_value,
    ];
};

export default useInput;
