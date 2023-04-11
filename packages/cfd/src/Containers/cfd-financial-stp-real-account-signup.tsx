import React from 'react';
import { Div100vhContainer } from '@deriv/components';
import { isDesktop, getAuthenticationStatusInfo } from '@deriv/shared';
import CFDPOA from '../Components/cfd-poa';
import CFDPOI from '../Components/cfd-poi';
import CFDPersonalDetailsContainer from './cfd-personal-details-container';
import { observer, useStore } from '@deriv/stores';

type TCFDFinancialStpRealAccountSignupProps = {
    onFinish: () => void;
};

type TNextStep = (index: number, value: { [key: string]: string | undefined }) => void;

type TItemsState<T> = {
    body: typeof CFDPOI | typeof CFDPOA | typeof CFDPersonalDetailsContainer;
    form_value: { [key: string]: string | undefined };
    forwarded_props: Array<Partial<keyof T>>;
};

const CFDFinancialStpRealAccountSignup = ({ onFinish }: TCFDFinancialStpRealAccountSignupProps) => {
    const {
        notifications: {
            refreshNotifications,
            removeNotificationMessage,
            removeNotificationByKey,
            addNotificationByKey,
        },
        client: {
            authentication_status,
            get_settings,
            client_email,
            is_fully_authenticated,
            landing_company,
            residence_list,
            states_list,
            fetchStatesList,
            account_status,
        },
        modules: {
            cfd: { storeProofOfAddress, jurisdiction_selected_shortcode, has_submitted_cfd_personal_details },
        },
    } = useStore();

    const passthroughProps = {
        refreshNotifications,
        removeNotificationMessage,
        removeNotificationByKey,
        addNotificationByKey,
        authentication_status,
        get_settings,
        client_email,
        is_fully_authenticated,
        landing_company,
        residence_list,
        states_list,
        fetchStatesList,
        account_status,
        storeProofOfAddress,
        jurisdiction_selected_shortcode,
        has_submitted_cfd_personal_details,
        onFinish,
    } as const;

    const [step, setStep] = React.useState(0);
    const [form_error, setFormError] = React.useState('');
    const state_index = step;
    let is_mounted = React.useRef(true).current;

    const { need_poi_for_vanuatu_maltainvest, need_poi_for_bvi_labuan } = getAuthenticationStatusInfo(account_status);

    const poi_config: TItemsState<typeof passthroughProps> = {
        body: CFDPOI,
        form_value: {
            poi_state: 'unknown',
        },
        forwarded_props: [
            'addNotificationByKey',
            'authentication_status',
            'refreshNotifications',
            'removeNotificationMessage',
            'removeNotificationByKey',
            'jurisdiction_selected_shortcode',
        ],
    };

    const poa_config: TItemsState<typeof passthroughProps> = {
        body: CFDPOA,
        form_value: {
            address_line_1: get_settings.address_line_1,
            address_line_2: get_settings.address_line_2,
            address_city: get_settings.address_city,
            address_state: get_settings.address_state,
            address_postcode: get_settings.address_postcode,
            upload_file: '',
        },
        forwarded_props: ['states_list', 'get_settings', 'storeProofOfAddress', 'refreshNotifications'],
    };

    const personal_details_config: TItemsState<typeof passthroughProps> = {
        body: CFDPersonalDetailsContainer,
        form_value: {
            citizen: '',
            place_of_birth: '',
            tax_residence: '',
            tax_identification_number: '',
            account_opening_reason: '',
        },
        forwarded_props: ['residence_list', 'landing_company'],
    };

    const should_show_poi = () => {
        if (jurisdiction_selected_shortcode === 'vanuatu' || jurisdiction_selected_shortcode === 'maltainvest') {
            return need_poi_for_vanuatu_maltainvest;
        }
        return need_poi_for_bvi_labuan;
    };
    const should_show_poa = !(
        authentication_status.document_status === 'pending' || authentication_status.document_status === 'verified'
    );

    const should_show_personal_details =
        !has_submitted_cfd_personal_details && jurisdiction_selected_shortcode !== 'maltainvest';

    const verification_configs = [
        ...(should_show_poi() ? [poi_config] : []),
        ...(should_show_poa ? [poa_config] : []),
        ...(should_show_personal_details ? [personal_details_config] : []),
    ];

    const [items, setItems] = React.useState<TItemsState<typeof passthroughProps>[]>(verification_configs);

    const clearError = () => {
        setFormError('');
    };

    React.useEffect(() => {
        refreshNotifications();
    }, [items, refreshNotifications]);

    React.useEffect(() => {
        fetchStatesList();
    }, [fetchStatesList]);

    const unmount = () => {
        is_mounted = false;
        onFinish();
    };

    const saveFormData = (index: number, value: { [key: string]: string | undefined }) => {
        if (!is_mounted) return; // avoiding state update on unmounted component
        const cloned_items: TItemsState<typeof passthroughProps>[] = [...items];
        cloned_items[index].form_value = value;
        setItems(cloned_items);
    };

    const nextStep: TNextStep = (index, value) => {
        clearError();
        if (step + 1 < items.length) {
            saveFormData(index, value);
            setStep(step + 1);
        } else unmount();
    };

    const prevStep = () => {
        if (step - 1 >= 0) {
            setStep(step - 1);
            setFormError('');
        } else unmount();
    };

    const getCurrent = (key?: keyof TItemsState<typeof passthroughProps>) => {
        return key ? items[state_index][key] : items[state_index];
    };

    const BodyComponent = getCurrent('body') as typeof CFDPOI & typeof CFDPOA & typeof CFDPersonalDetailsContainer;

    const form_value = getCurrent('form_value');

    const passthrough = (
        (getCurrent('forwarded_props') || []) as TItemsState<typeof passthroughProps>['forwarded_props']
    ).reduce((forwarded_prop, item) => {
        return Object.assign(forwarded_prop, {
            [item]: passthroughProps[item],
        });
    }, {});

    return (
        <Div100vhContainer
            className='cfd-financial-stp-modal'
            id='real_mt5_financial_stp_account_opening'
            is_disabled={isDesktop()}
            height_offset='40px'
        >
            <div className='cfd-financial-stp-modal__body' data-testid='dt_cfd_financial_stp_modal_body'>
                <BodyComponent
                    value={form_value}
                    index={state_index}
                    onSubmit={nextStep}
                    height='auto'
                    onCancel={prevStep}
                    onSave={saveFormData}
                    form_error={form_error}
                    {...passthrough}
                />
            </div>
        </Div100vhContainer>
    );
};

export default observer(CFDFinancialStpRealAccountSignup);
