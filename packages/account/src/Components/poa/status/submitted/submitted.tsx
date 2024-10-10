import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isNavigationFromP2P, isNavigationFromDerivGO, routes } from '@deriv/shared';
import IconMessageContent from '../../../icon-message-content';
import RouteButton from '../../../route-button';
import { TPoaStatusProps } from '../../../../Types';

export const Submitted = ({ needs_poi, redirect_button }: TPoaStatusProps) => {
    const message = localize('Review in progress');
    const is_redirected_from_platform = isNavigationFromP2P() || isNavigationFromDerivGO();
    if (needs_poi) {
        return (
            <div className='account-management__container'>
                <IconMessageContent message={message} icon={<Icon icon='IcPoaVerified' size={128} />}>
                    <div className='account-management__text-container'>
                        <Text align='center' size='xs' as='p'>
                            {localize(
                                'Your proof of address is under review. We’ll get back to you in 1–3 working days.'
                            )}
                        </Text>
                        <Text align='center' size='xs' as='p'>
                            {localize('To start trading, you also need to verify your identity.')}
                        </Text>
                    </div>
                    <RouteButton button_label={localize('Next')} route={routes.proof_of_identity} />
                </IconMessageContent>
            </div>
        );
    }
    return (
        <div className='account-management__container'>
            <IconMessageContent
                message={message}
                text={localize('Your proof of address is under review. We’ll get back to you in 1–3 working days.')}
                icon={<Icon icon='IcPoaVerified' size={128} />}
            >
                {redirect_button ||
                    (!is_redirected_from_platform && (
                        <RouteButton button_label={localize("Return to Trader's Hub")} route={routes.traders_hub} />
                    ))}
            </IconMessageContent>
        </div>
    );
};
