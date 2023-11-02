// @ts-expect-error remove this line when ProofOfIdentityContainerForMt5 is converted to TS
import ProofOfIdentityContainerForMt5 from '@deriv/account/src/Sections/Verification/ProofOfIdentity/proof-of-identity-container-for-mt5.jsx';
import React from 'react';
import { useStore, observer } from '@deriv/stores';
import { TCFDPOIProps } from 'Types/components.types';

const CFDPOI = observer(({ index, onSave, onSubmit, ...props }: TCFDPOIProps) => {
    const { client } = useStore();
    const { account_settings, residence_list } = client;

    const [poi_state, setPOIState] = React.useState<string>('none');
    const citizen = account_settings?.citizen || account_settings?.country_code;
    const citizen_data = residence_list?.find(item => item.value === citizen);

    const onStateChange = (status: string) => {
        setPOIState(status);
        onSave(index, { poi_state: status });
        onSubmit(index, { poi_state });
    };
    return (
        <ProofOfIdentityContainerForMt5
            {...props}
            onStateChange={(status: string) => onStateChange(status)}
            citizen_data={citizen_data}
        />
    );
});

export default CFDPOI;
