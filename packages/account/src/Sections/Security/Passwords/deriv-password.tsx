import { Fragment, useState } from 'react';
import { useVerifyEmail } from '@deriv/api';
import { Button, Icon, Popover, Text } from '@deriv/components';
import { getBrandWebsiteName, getPlatformSettings, toTitleCase } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, useTranslations } from '@deriv-com/translations';
import { BrandDerivLogoCoralIcon } from '@deriv/quill-icons';
import FormSubHeader from '../../../Components/form-sub-header';
import SentEmailModal from '../../../Components/sent-email-modal';
import PlatformDescription from './platform-description';

/**
 * Displays a change password button and with instructions on how to change the password.
 * @name DerivPassword
 * @returns {React.ReactNode}
 */
const DerivPassword = observer(() => {
    const { localize } = useTranslations();
    const {
        traders_hub: { is_eu_user, financial_restricted_countries },
        client: { social_identity_provider, is_social_signup, email },
    } = useStore();
    const { mutate } = useVerifyEmail();

    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = useState(false);

    const onClickSendEmail = () => {
        if (social_identity_provider === 'apple') {
            mutate({ verify_email: email, type: 'request_email' });
        } else {
            mutate({ verify_email: email, type: 'reset_password' });
        }
        setIsSentEmailModalOpen(true);
    };

    const capitalized_identifier = social_identity_provider ? toTitleCase(social_identity_provider) : '';
    const brand_website_name = getBrandWebsiteName();
    const platform_name_dbot = getPlatformSettings('dbot').name;
    const platform_name_go = getPlatformSettings('go').name;
    const platform_name_smarttrader = getPlatformSettings('smarttrader').name;
    const platform_name_trader = getPlatformSettings('trader').name;
    const platform_name_ctrader = getPlatformSettings('ctrader').name;
    const platform_values = {
        platform_name_trader,
        platform_name_dbot,
        platform_name_smarttrader,
        platform_name_go,
        platform_name_ctrader,
    };

    return (
        <Fragment>
            <FormSubHeader title={localize('Deriv password')} />
            <div className='account__passwords-wrapper'>
                <Fragment>
                    <Text as='p' className='passwords-platform__desc' color='prominent' size='xs' weight='lighter'>
                        <PlatformDescription
                            brand_website_name={brand_website_name}
                            platform_values={platform_values}
                            is_eu_user={is_eu_user}
                            financial_restricted_countries={financial_restricted_countries}
                        />
                    </Text>
                    <Text as='p' className='passwords-platform__desc' color='prominent' size='xs' weight='lighter'>
                        <Localize
                            i18n_default_text='Apps you have linked to your <0>Deriv password:</0>'
                            components={[<strong key={0} />]}
                        />
                    </Text>
                    <div className='passwords-platform__logo-container'>
                        <BrandDerivLogoCoralIcon height='23px' width='23px' />
                        <Text line_height='l' size='xs' weight='bold'>
                            {brand_website_name}
                        </Text>
                    </div>

                    {
                        //TODO reuse this piece of code in future by mapping through the platforms.
                    }
                    <div className='passwords-platform__icons'>
                        <Popover alignment='bottom' message={platform_name_trader}>
                            <Icon
                                icon={`${getPlatformSettings('trader').icon}-dashboard`}
                                size={32}
                                description='trader'
                            />
                        </Popover>
                        {!is_eu_user && !financial_restricted_countries && (
                            <Fragment>
                                <Popover alignment='bottom' message={platform_name_dbot}>
                                    <Icon
                                        icon={`${getPlatformSettings('dbot').icon}-dashboard`}
                                        size={32}
                                        description='dbot'
                                    />
                                </Popover>
                                <Popover alignment='bottom' message={platform_name_smarttrader}>
                                    <Icon
                                        icon={`${getPlatformSettings('smarttrader').icon}-dashboard`}
                                        size={32}
                                        description='smarttrader'
                                    />
                                </Popover>
                            </Fragment>
                        )}
                        {(!is_eu_user || financial_restricted_countries) && (
                            <Fragment>
                                <Popover alignment='bottom' message={platform_name_go}>
                                    <Icon
                                        icon={`${getPlatformSettings('go').icon}-dashboard`}
                                        size={32}
                                        description='derivgo'
                                    />
                                </Popover>
                                <Popover alignment='bottom' message={platform_name_ctrader}>
                                    <Icon
                                        icon={`${getPlatformSettings('ctrader').icon}-dashboard`}
                                        size={32}
                                        description='ctrader'
                                    />
                                </Popover>
                            </Fragment>
                        )}
                    </div>
                </Fragment>
                {is_social_signup ? (
                    <Fragment>
                        <div className='account__passwords-item passwords-social-buttons'>
                            <div className='account__passwords-linked' onClick={onClickSendEmail}>
                                {social_identity_provider ? (
                                    <Fragment>
                                        <Icon icon={`IcStock${capitalized_identifier}`} size={16} />
                                        <Text size='xs'>
                                            <Localize
                                                i18n_default_text='Unlink from {{identifier_title}}'
                                                values={{ identifier_title: capitalized_identifier }}
                                            />
                                        </Text>
                                        <Icon icon='IcChevronRight' size={16} />
                                    </Fragment>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </Fragment>
                ) : (
                    <div>
                        <Button
                            className='account__passwords-footer-btn'
                            type='button'
                            onClick={onClickSendEmail}
                            has_effect
                            text={localize('Change password')}
                            primary
                            large
                        />
                    </div>
                )}
                <SentEmailModal
                    is_open={is_sent_email_modal_open}
                    onClose={() => setIsSentEmailModalOpen(false)}
                    identifier_title={capitalized_identifier}
                    onClickSendEmail={onClickSendEmail}
                    is_modal_when_mobile={true}
                />
            </div>
        </Fragment>
    );
});

export default DerivPassword;
