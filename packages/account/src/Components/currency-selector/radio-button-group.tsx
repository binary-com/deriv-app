import React from 'react';
import classNames from 'classnames';

export type TRadioButtonGroup = {
    className: string;
    is_fiat?: boolean;
    is_title_enabled?: boolean;
    item_count: number;
    label?: string;
    description?: React.ReactNode;
};

/**
 * Wrapper component for RadioButton
 * @name RadioButtonGroup
 * @param {string} className - class name for styling
 * @param {boolean} is_fiat - is fiat currency
 * @param {boolean} is_title_enabled - is title enabled
 * @param {number} item_count - number of items
 * @param {string} label - label for the radio button
 * @param {React.ReactNode} description - description for the radio button
 * @returns {React.ReactNode} - returns a React node
 */
const RadioButtonGroup = ({
    children,
    label,
    className,
    is_title_enabled = true,
    is_fiat,
    item_count,
    description,
}: React.PropsWithChildren<TRadioButtonGroup>) => {
    return (
        <div className={className}>
            {is_title_enabled && (
                <h2
                    className={classNames(`${className}--is-header`, {
                        'currency-selector__is-crypto': !is_fiat,
                    })}
                >
                    {label}
                </h2>
            )}
            {is_fiat && <div className='currency-selector__description'>{description}</div>}
            <div
                className={classNames('currency-list__items', {
                    'currency-list__items__center': item_count < 4,
                    'currency-list__items__is-fiat': is_fiat,
                    'currency-list__items__is-crypto': !is_fiat,
                })}
            >
                {children}
            </div>
        </div>
    );
};

export default RadioButtonGroup;
