import React from 'react';
import { Button } from '@deriv-com/quill-ui';
import { LabelPairedPresentationScreenSmRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import DefinitionModal from './definition-modal';
import DescriptionModal from './decription-modal';

type TGuide = {
    is_minimalistic_look?: boolean;
};

const Guide = ({ is_minimalistic_look = false }: TGuide) => {
    const [is_description_opened, setIsDescriptionOpened] = React.useState(false);
    const [selected_contract_type, setSelectedContractType] = React.useState(CONTRACT_LIST['RISE/FALL']);
    const [selected_term, setSelectedTerm] = React.useState<string>();

    const onChipSelect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setSelectedContractType((e.target as EventTarget & HTMLButtonElement).textContent ?? '');
    };

    const onTermClick = (term: string) => {
        setSelectedTerm(term);
    };

    return (
        <React.Fragment>
            <Button
                color='black'
                icon={<LabelPairedPresentationScreenSmRegularIcon />}
                iconPosition='start'
                label={is_minimalistic_look ? '' : <Localize i18n_default_text='Guide' />}
                onClick={() => setIsDescriptionOpened(true)}
                size='md'
                type='button'
                variant={is_minimalistic_look ? 'tertiary' : 'secondary'}
            />
            <DescriptionModal
                is_open={is_description_opened}
                onClose={() => setIsDescriptionOpened(false)}
                onChipSelect={onChipSelect}
                onTermClick={onTermClick}
                selected_contract_type={selected_contract_type}
            />
            <DefinitionModal
                contract_type={selected_contract_type}
                term={selected_term ?? ''}
                onClose={() => setSelectedTerm('')}
            />
        </React.Fragment>
    );
};

export default Guide;
