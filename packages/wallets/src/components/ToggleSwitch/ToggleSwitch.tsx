import React, { ChangeEvent, forwardRef } from 'react';
import './ToggleSwitch.scss';

interface ToggleSwitchProps {
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    value: boolean;
}

const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(({ onChange, value }, ref) => (
    <label className='wallets-toggle-switch'>
        <input checked={value} data-testid='dt_wallets_toggle_switch' onChange={onChange} ref={ref} type='checkbox' />
        <span className='wallets-toggle-switch__slider' />
    </label>
));

ToggleSwitch.displayName = 'ToggleSwitch';
export default ToggleSwitch;
