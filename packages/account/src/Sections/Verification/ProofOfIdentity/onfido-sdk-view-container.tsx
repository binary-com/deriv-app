import React, { useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useSettings } from '@deriv/api';
import { ResidenceList } from '@deriv/api-types';
import { Loading, ThemedScrollbars } from '@deriv/components';
import { useNotificationEvent, useServiceToken } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import ErrorMessage from '../../../Components/error-component';
import MissingPersonalDetails from '../../../Components/poi/missing-personal-details';
import PoiConfirmWithExampleFormContainer from '../../../Components/poi/poi-confirm-with-example-form-container';
import OnfidoSdkView from './onfido-sdk-view';
import type { SdkError, SdkHandle, SdkResponse, SupportedLanguages } from '../../../Types';
import { convertAlpha2toAlpha3, convertAlpha3toAlpha2, getOnfidoSupportedLocaleCode } from '../../../Helpers/utils';
import { getOnfidoPhrases } from '../../../Constants/onfido';
import { useDevice } from '@deriv-com/ui';

type TAPIError = {
    code?: string;
    message?: string;
    type?: string;
};

type TOnfidoSdkViewContainer = {
    country_code: string;
    documents_supported:
        | string[]
        | DeepRequired<ResidenceList>[0]['identity']['services']['onfido']['documents_supported'];
    getChangeableFields: () => string[];
    handleViewComplete: () => void;
    height?: number | string;
    is_default_enabled?: boolean;
};

const OnfidoSdkViewContainer = observer(
    ({
        country_code,
        documents_supported,
        getChangeableFields,
        handleViewComplete,
        height,
        is_default_enabled,
    }: TOnfidoSdkViewContainer) => {
        const [api_error, setAPIError] = React.useState<string>();
        const [missing_personal_details, setMissingPersonalDetails] = React.useState('');
        const [is_onfido_disabled, setIsOnfidoDisabled] = React.useState(true);
        const [is_confirmed, setIsConfirmed] = React.useState(false);
        const [is_onfido_initialized, setIsOnfidoInitialized] = React.useState(false);
        // used to check that we only initialize and load the onfido script once
        const [is_onfido_loaded, setIsOnfidoLoaded] = React.useState(false);
        const { data: account_settings } = useSettings();

        const { send, isSuccess: isNotified } = useNotificationEvent();
        const { common } = useStore();
        const { current_language } = common;
        const { isMobile } = useDevice();

        // IDV country code - Alpha ISO2. Onfido country code - Alpha ISO3
        const onfido_country_code = convertAlpha2toAlpha3(country_code);

        // Service Token country code - Alpha ISO2
        const token_country_code = convertAlpha3toAlpha2(country_code);

        const { service_token, isSuccess, isError, error, isLoading } = useServiceToken({
            service: 'onfido',
            country: token_country_code,
        });

        const onfido_init = React.useRef<SdkHandle>();

        // Onfido `document_supported` checks are made for an array of string.
        // Ensure that `document_supported` passed respects this no the matter source.
        const onfido_documents = Array.isArray(documents_supported)
            ? documents_supported
            : Object.keys(documents_supported).map(d => documents_supported[d].display_name);

        let component_to_load: React.ReactNode;

        const onComplete = React.useCallback(
            (data: Omit<SdkResponse, 'data'> & { data?: { id?: string } }) => {
                onfido_init?.current?.tearDown();
                const document_ids = Object.keys(data).map(key => data[key as keyof SdkResponse]?.id);
                if (document_ids?.length) {
                    send({
                        category: 'authentication',
                        event: 'poi_documents_uploaded',
                        args: {
                            documents: document_ids as Array<string>,
                        },
                    });
                }
            },
            [send]
        );

        const initOnfido = React.useCallback(
            async (service_token: string) => {
                if (!service_token) return;
                try {
                    onfido_init.current = await window.Onfido.init({
                        containerId: 'onfido',
                        language: {
                            locale: getOnfidoSupportedLocaleCode(current_language) as SupportedLanguages,
                            phrases: getOnfidoPhrases(),
                            mobilePhrases: getOnfidoPhrases(),
                        },
                        token: service_token,
                        useModal: false,
                        useMemoryHistory: true,
                        onComplete,
                        steps: [
                            {
                                type: 'document',
                                options: {
                                    documentTypes: {
                                        passport: onfido_documents.some(doc => /Passport/g.test(doc)),
                                        driving_licence: onfido_documents.some(doc => /Driving Licence/g.test(doc))
                                            ? {
                                                  country: onfido_country_code,
                                              }
                                            : false,
                                        national_identity_card: onfido_documents.some(doc =>
                                            /National Identity Card/g.test(doc)
                                        )
                                            ? {
                                                  country: onfido_country_code,
                                              }
                                            : false,
                                    },
                                    hideCountrySelection: true,
                                },
                            },
                            'face',
                        ],
                    });
                    setIsOnfidoInitialized(true);
                } catch (err) {
                    setAPIError((err as SdkError)?.message ?? err);
                    setIsOnfidoDisabled(true);
                    onfido_init.current = undefined;
                } finally {
                    setIsOnfidoLoaded(true);
                }
            },
            [onComplete, onfido_documents, onfido_country_code, current_language]
        );

        const loadOnfidoSdkScript = React.useCallback(
            (token: string) => {
                document.getElementById('onfido_sdk')?.remove();
                document.getElementById('onfido_style')?.remove();

                // check if the onfido sdk script has been loaded, and if its still loading the onfido script, don't re-attempt to load the script again
                const script_node = document.createElement('script');
                const link_node = document.createElement('link');

                // [TODO] - Need to lock version of onfido sdk - Current version in CDN is 13.8.4
                script_node.id = 'onfido_sdk';
                script_node.src = 'https://assets.onfido.com/web-sdk-releases/13.8.4/onfido.min.js';
                link_node.href = 'https://assets.onfido.com/web-sdk-releases/13.8.4/style.css';
                link_node.rel = 'stylesheet';
                link_node.id = 'onfido_style';

                document.body.appendChild(script_node);
                document.body.appendChild(link_node);

                script_node.addEventListener('load', () => {
                    initOnfido(token);
                });
            },
            [initOnfido]
        );

        const handleError = (error: TAPIError) => {
            switch (error.code) {
                case 'MissingPersonalDetails':
                    setMissingPersonalDetails('all');
                    break;
                case 'InvalidPostalCode':
                    setMissingPersonalDetails('postal_code');
                    break;
                default:
                    setAPIError(error.message);
                    break;
            }
        };

        const onConfirm = useCallback(() => {
            setIsConfirmed(true);
            setIsOnfidoDisabled(false);
        }, []);

        React.useEffect(() => {
            if (isSuccess && service_token?.onfido?.token && !is_onfido_loaded) {
                loadOnfidoSdkScript(service_token?.onfido?.token);
            } else if (isError) {
                handleError(error as TAPIError);
            }
        }, [error, isError, isSuccess, is_onfido_loaded, loadOnfidoSdkScript, service_token?.onfido?.token]);

        React.useEffect(() => {
            /**
             * Enables onfido sdk
             * Pass is_default_enabled to enable onfido immediately if personal detail component is not required
             * so no user prompt will be there so submit the details in i.e. in case of flow for nigerian clients ATM
             */
            if (is_default_enabled) {
                setIsOnfidoDisabled(false);
            }
        }, [is_default_enabled]);

        React.useEffect(() => {
            /**
             * Handles cleanup operations when document submission is completed
             */
            if (isNotified) {
                handleViewComplete();
            }
        }, [handleViewComplete, isNotified]);

        if (isLoading || !is_onfido_loaded) {
            component_to_load = <Loading is_fullscreen={false} />;
        } else if (missing_personal_details) {
            component_to_load = (
                <MissingPersonalDetails
                    has_invalid_postal_code={missing_personal_details === 'postal_code'}
                    from='proof_of_identity'
                />
            );
        } else if (api_error) {
            // Error message will only display if retry count exceeds 3
            component_to_load = <ErrorMessage message={api_error} />;
        }

        return (
            <ThemedScrollbars is_bypassed={isMobile} height={height}>
                <div className='onfido-container'>
                    {component_to_load || (
                        <CSSTransition
                            appear={is_onfido_disabled}
                            in={is_onfido_disabled}
                            timeout={{
                                exit: 350,
                            }}
                            classNames={{
                                exit: 'account-form__poi-confirm-example_wrapper--exit',
                            }}
                            unmountOnExit
                        >
                            <div className='account-form__poi-confirm-example_wrapper account-form__poi-confirm-example_container'>
                                <PoiConfirmWithExampleFormContainer
                                    account_settings={account_settings}
                                    getChangeableFields={getChangeableFields}
                                    onFormConfirm={onConfirm}
                                />
                            </div>
                        </CSSTransition>
                    )}
                    <OnfidoSdkView
                        is_onfido_disabled={is_onfido_disabled}
                        is_confirmed={is_confirmed}
                        is_onfido_container_hidden={!!component_to_load}
                        is_onfido_initialized={is_onfido_initialized}
                    />
                </div>
            </ThemedScrollbars>
        );
    }
);

OnfidoSdkViewContainer.displayName = 'OnfidoSdkViewContainer';

export default OnfidoSdkViewContainer;
