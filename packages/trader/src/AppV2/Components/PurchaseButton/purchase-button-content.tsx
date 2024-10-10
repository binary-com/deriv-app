import React from 'react';
import clsx from 'clsx';
import { CaptionText } from '@deriv-com/quill-ui';
import { useTraderStore } from 'Stores/useTraderStores';
import { getLocalizedBasis } from '@deriv/shared';
import { Money } from '@deriv/components';

type TPurchaseButtonContent = {
    has_no_button_content?: boolean;
    info: ReturnType<typeof useTraderStore>['proposal_info'][0] | Record<string, never>;
    is_reverse?: boolean;
} & Pick<
    ReturnType<typeof useTraderStore>,
    'currency' | 'has_open_accu_contract' | 'is_multiplier' | 'is_vanilla' | 'is_turbos'
>;

const PurchaseButtonContent = ({
    currency,
    has_open_accu_contract,
    has_no_button_content,
    info,
    is_multiplier,
    is_turbos,
    is_vanilla,
    is_reverse,
}: TPurchaseButtonContent) => {
    if (has_no_button_content) return null;

    const { payout, stake } = getLocalizedBasis();

    const getAmount = () => {
        const { stake, obj_contract_basis } = info;
        return is_multiplier ? stake : obj_contract_basis?.value;
    };
    const getTextBasis = () => (is_multiplier ? stake : payout);

    const text_basis = getTextBasis();
    const amount = getAmount();
    const is_content_empty = !text_basis || !amount;

    return (
        <CaptionText
            size='sm'
            className={clsx(
                'purchase-button__information__wrapper',
                is_reverse && 'purchase-button__information__wrapper--reverse',
                is_content_empty && 'purchase-button__information__wrapper--disabled-placeholder'
            )}
            data-testid='dt_purchase_button_wrapper'
        >
            {!is_content_empty && (
                <React.Fragment>
                    <CaptionText
                        as='span'
                        size='sm'
                        className={clsx(!has_open_accu_contract && 'purchase-button__information__item')}
                        color='quill-typography__color--prominent'
                    >
                        {text_basis}
                    </CaptionText>
                    <CaptionText
                        as='span'
                        size='sm'
                        className={clsx(!has_open_accu_contract && 'purchase-button__information__item')}
                        color='quill-typography__color--prominent'
                    >
                        <Money
                            amount={amount}
                            currency={currency}
                            should_format={!is_turbos && !is_vanilla}
                            show_currency
                        />
                    </CaptionText>
                </React.Fragment>
            )}
        </CaptionText>
    );
};

export default PurchaseButtonContent;
