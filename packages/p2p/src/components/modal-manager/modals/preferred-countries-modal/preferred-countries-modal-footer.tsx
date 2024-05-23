import React from 'react';
import { Button } from '@deriv/components';
import { Localize } from 'Components/i18next';

type TPreferredCountriesModalFooterProps = {
    eligible_countries: string[];
    onClear: () => void;
    onApply: () => void;
    selected_countries: string[];
};

const PreferredCountriesModalFooter = ({
    eligible_countries,
    onClear,
    onApply,
    selected_countries,
}: TPreferredCountriesModalFooterProps) => {
    const is_clear_btn_disabled = selected_countries?.length === 0;
    const is_apply_btn_disabled = selected_countries?.length === 0 || selected_countries === eligible_countries;

    return (
        <>
            <Button disabled={is_clear_btn_disabled} large onClick={onClear} secondary>
                <Localize i18n_default_text='Clear' />
            </Button>
            <Button disabled={is_apply_btn_disabled} primary large onClick={onApply}>
                <Localize i18n_default_text='Apply' />
            </Button>
        </>
    );
};

export default PreferredCountriesModalFooter;
