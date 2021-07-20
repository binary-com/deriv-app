import React from 'react';
import classNames from 'classnames';
import { Localize } from '@deriv/translations';
import { Popover, Icon } from '@deriv/components';
import { getCurrencyDisplayCode } from '@deriv/shared';

const USTPopover = ({ id }) => {
    let popover_message;
    if (/^UST$/i.test(id)) {
        popover_message = (
            <Localize
                i18n_default_text={
                    'Send only Tether Omni to this deposit address.<0 /><0 />Sending Tether ERC20 to this address will result in the loss of your deposit.'
                }
                components={[<br key={0} />]}
            />
        );
    } else {
        popover_message = (
            <Localize
                i18n_default_text={
                    'Tether as an ERC20 token (eUSDT) is a version of Tether that is hosted on Ethereum, an open software platform where anyone can build and deploy decentralised applications.'
                }
            />
        );
    }

    return (
        <Popover
            alignment='top'
            className='currency-list__popover'
            disable_message_icon
            icon='info'
            is_bubble_hover_enabled
            message={popover_message}
            zIndex={9999}
        />
    );
};

// Radio input
const RadioButton = ({
    field: { name, value, onChange, onBlur },
    icon,
    id,
    label,
    second_line_label,
    className,
    onClick,
    ...props
}) => {
    return (
        <React.Fragment>
            <input
                name={name}
                id={id}
                type='radio'
                value={id} // could be something else for output?
                checked={id === value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={props.selected}
                className={classNames('currency-list__radio-button')}
                {...props}
            />
            <label
                htmlFor={id}
                className={classNames('currency-list__item', {
                    'currency-list__item--selected': id === value,
                    'currency-list__item--current': props.selected,
                })}
                onClick={onClick}
            >
                {icon ? (
                    <React.Fragment>
                        <Icon className='currency-list__icon' icon={icon} />
                        <div className='label currency-list__item-text'>
                            <div className='currency-list__item-label'>{label}</div>
                            <div className='currency-list__item-code'>{second_line_label}</div>
                        </div>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Icon className='currency-list__icon' icon={`IcCurrency-${id.toLowerCase()}`} />
                        {/^(UST|eUSDT)$/i.test(id) && <USTPopover id={id} />}
                        <div className='label currency-list__item-text'>
                            <div className='currency-list__item-label'>{label}</div>
                            <div className='currency-list__item-code'>({getCurrencyDisplayCode(id)})</div>
                        </div>
                    </React.Fragment>
                )}
            </label>
        </React.Fragment>
    );
};

export default RadioButton;
