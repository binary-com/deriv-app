import React from 'react';
import { Button, Text } from '@deriv-com/quill-ui';
import { LabelPairedPresentationScreenSmRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { AVAILABLE_CONTRACTS, CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import GuideDefinitionModal from './guide-definition-modal';
import GuideDescriptionModal from './guide-description-modal';
import { getContractTypesConfig } from '@deriv/shared';
import useContractsForCompany from 'AppV2/Hooks/useContractsForCompany';

type TGuide = {
    has_label?: boolean;
    show_guide_for_selected_contract?: boolean;
};

const Guide = observer(({ has_label, show_guide_for_selected_contract }: TGuide) => {
    const {
        ui: { is_dark_mode_on },
    } = useStore();
    const { contract_type, is_vanilla } = useTraderStore();
    const contract_type_title = is_vanilla ? CONTRACT_LIST.VANILLAS : getContractTypesConfig()[contract_type]?.title;
    const { trade_types } = useContractsForCompany();
    const order = [
        CONTRACT_LIST.RISE_FALL,
        CONTRACT_LIST.ACCUMULATORS,
        CONTRACT_LIST.MULTIPLIERS,
        CONTRACT_LIST.VANILLAS,
        CONTRACT_LIST.TURBOS,
        CONTRACT_LIST.HIGHER_LOWER,
        CONTRACT_LIST.TOUCH_NO_TOUCH,
        CONTRACT_LIST.MATCHES_DIFFERS,
        CONTRACT_LIST.EVEN_ODD,
        CONTRACT_LIST.OVER_UNDER,
    ];

    const filtered_contract_list = AVAILABLE_CONTRACTS.filter(contract =>
        trade_types.some((trade: { text?: string }) => trade.text === contract.id)
    );

    const ordered_contract_list = [...filtered_contract_list].sort(
        (a, b) => order.findIndex(item => item === a.id) - order.findIndex(item => item === b.id)
    );

    const [is_description_opened, setIsDescriptionOpened] = React.useState(false);
    const [selected_contract_type, setSelectedContractType] = React.useState(contract_type_title);
    const [selected_term, setSelectedTerm] = React.useState<string>('');

    const onChipSelect = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setSelectedContractType((e.target as EventTarget & HTMLButtonElement).textContent ?? '');
    }, []);

    const onClose = React.useCallback(() => setIsDescriptionOpened(false), []);

    React.useEffect(() => {
        if (show_guide_for_selected_contract) setSelectedContractType(contract_type_title);
    }, [show_guide_for_selected_contract, contract_type_title]);

    return (
        <React.Fragment>
            <Button
                color={is_dark_mode_on ? 'white' : 'black'}
                icon={<LabelPairedPresentationScreenSmRegularIcon key='guide-button-icon' />}
                onClick={() => setIsDescriptionOpened(true)}
                variant={has_label ? 'secondary' : 'tertiary'}
            >
                {has_label && (
                    <Text size='sm' bold color='quill-typography__color--prominent'>
                        <Localize i18n_default_text='Guide' />
                    </Text>
                )}
            </Button>
            <GuideDescriptionModal
                contract_list={ordered_contract_list}
                is_dark_mode_on={is_dark_mode_on}
                is_open={is_description_opened}
                onChipSelect={onChipSelect}
                onClose={onClose}
                onTermClick={setSelectedTerm}
                selected_contract_type={selected_contract_type}
                show_guide_for_selected_contract={show_guide_for_selected_contract}
            />
            <GuideDefinitionModal
                contract_type={selected_contract_type}
                term={selected_term}
                onClose={() => setSelectedTerm('')}
            />
        </React.Fragment>
    );
});

export default Guide;
