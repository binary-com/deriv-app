import React from 'react';
import { TJurisdictionModalContent } from '../props.types';
import JurisdictionCheckBox from './jurisdiction-modal-content-items/jurisdiction-modal-checkbox';
import JurisdictionCard from './jurisdiction-modal-content-items/jurisdiction-modal-card/jurisdiction-card';
import JurisdictionModalFootNote from './jurisdiction-modal-content-items/jurisdiction-modal-foot-note';

const JurisdictionModalContent = ({
    account_status,
    account_type,
    jurisdiction_selected_shortcode,
    setJurisdictionSelectedShortcode,
    synthetic_available_accounts,
    financial_available_accounts,
    checked,
    setChecked,
    real_synthetic_accounts_existing_data,
    real_financial_accounts_existing_data,
    is_virtual,
}: TJurisdictionModalContent) => {
    const card_classname = `cfd-jurisdiction-card--${account_type}`;

    const cardsToBeShown = (type_of_card: string) =>
        account_type === 'synthetic'
            ? synthetic_available_accounts?.some(account => account.shortcode === type_of_card)
            : financial_available_accounts?.some(account => account.shortcode === type_of_card);

    const disableCard = (type_of_card: string) => {
        if (is_virtual && type_of_card !== 'svg') {
            return true;
        }
        return account_type === 'synthetic'
            ? real_synthetic_accounts_existing_data?.some(account => account.landing_company_short === type_of_card)
            : real_financial_accounts_existing_data?.some(account => account.landing_company_short === type_of_card);
    };
    const jurisdiction_cards_array = ['svg', 'bvi', 'vanuatu', 'labuan', 'maltainvest'];
    return (
        <>
            <div className={`${card_classname}__wrapper`}>
                {jurisdiction_cards_array.map(
                    card =>
                        cardsToBeShown(card) && (
                            <JurisdictionCard
                                key={`${account_type}_${card}`}
                                type_of_card={card}
                                disabled={disableCard(card)}
                                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                                synthetic_available_accounts={synthetic_available_accounts}
                                financial_available_accounts={financial_available_accounts}
                                account_type={account_type}
                                setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                            />
                        )
                )}
            </div>
            <JurisdictionModalFootNote
                account_status={account_status}
                card_classname={card_classname}
                account_type={account_type}
                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
            />
            <JurisdictionCheckBox
                account_status={account_status}
                is_checked={checked}
                onCheck={() => setChecked(!checked)}
                class_name={`${card_classname}__jurisdiction-checkbox`}
                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
            />
        </>
    );
};

export default JurisdictionModalContent;
