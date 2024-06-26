import React from 'react';
import { Text } from '@deriv/components';
import { getLegalEntityName, Jurisdiction, TBrokerCodes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

/**
 * Renders a horizontal line
 * @name Hr
 * @returns JSX.Element
 */
export const Hr = () => <div className='terms-of-use__hr' />;

/**
 * Renders the broker specific message based on the broker code
 * @name BrokerSpecificMessage
 * @param target - Broker code
 * @returns JSX.Element
 */

export const BrokerSpecificMessage = ({ target }: { target: TBrokerCodes }) => {
    const { isDesktop } = useDevice();

    return (
        <React.Fragment>
            <Text as='h4' size='xs' weight='bold'>
                <Localize i18n_default_text='Jurisdiction and choice of law' />
            </Text>
            <Text as='p' size={isDesktop ? 'xs' : 'xxs'}>
                {target === Jurisdiction.SVG ? (
                    <Localize
                        i18n_default_text='Your account will be opened with {{legal_entity_name}}, and will be subject to the laws of Saint Vincent and the Grenadines.'
                        values={{
                            legal_entity_name: getLegalEntityName(Jurisdiction.SVG),
                        }}
                    />
                ) : (
                    <Localize
                        i18n_default_text='Your account will be opened with {{legal_entity_name}}, regulated by the Malta Financial Services Authority (MFSA), and will be subject to the laws of Malta.'
                        values={{
                            legal_entity_name: getLegalEntityName(Jurisdiction.MALTA_INVEST),
                        }}
                    />
                )}
            </Text>
            <Hr />
            <Text as='h4' size='xs' weight='bold'>
                <Localize i18n_default_text='Risk warning' />
            </Text>
            <Text as='p' size={isDesktop ? 'xs' : 'xxs'}>
                <Localize i18n_default_text='The financial trading services offered on this site are only suitable for customers who accept the possibility of losing all the money they invest and who understand and have experience of the risk involved in the purchase of financial contracts. Transactions in financial contracts carry a high degree of risk. If the contracts you purchased expire as worthless, you will lose all your investment, which includes the contract premium.' />
            </Text>
            {target === Jurisdiction.MALTA_INVEST && (
                <React.Fragment>
                    <Hr />
                    <Text as='h4' size='xs' weight='bold'>
                        <Localize i18n_default_text='Trading accounts and funds' />
                    </Text>
                    <Text as='p' size={isDesktop ? 'xs' : 'xxs'}>
                        <Localize i18n_default_text="You acknowledge that, subject to the Company's discretion, applicable regulations, and internal checks being fulfilled, we will open an account for you and allow you to deposit funds during the client acceptance procedure. However, until the verification of your account is completed, you will not be able to trade, withdraw or make further deposits. If you do not provide relevant documents within 30-days, we will refund the deposited amount through the same payment method you used to deposit." />
                    </Text>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

/**
 * Returns the generic terms of use message
 * @name SVGDescription
 * @returns JSX.Element
 */
export const SharedMessage = () => {
    const { isDesktop } = useDevice();
    return (
        <React.Fragment>
            <Text as='h4' size='xs' weight='bold'>
                <Localize i18n_default_text='Real accounts are not available to politically exposed persons (PEPs).' />
            </Text>
            <Text as='p' size={isDesktop ? 'xs' : 'xxs'}>
                <Localize i18n_default_text='A politically exposed person (PEP) is someone appointed with a prominent public position. Close associates and family members of a PEP are also considered to be PEPs.' />
            </Text>
        </React.Fragment>
    );
};
