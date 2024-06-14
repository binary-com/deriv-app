import React from 'react';
import { Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import './cashier-onboarding-card.scss';

type TProps = {
    title: string;
    description: string;
    onClick?: VoidFunction;
};

const CashierOnboardingCard: React.FC<React.PropsWithChildren<TProps>> = observer(
    ({ title, description, onClick, children }) => {
        const { ui } = useStore();
        const { is_dark_mode_on, is_mobile_or_tablet } = ui;

        return (
            <div>
                <Text size={is_mobile_or_tablet ? 's' : 'sm'} weight='bold' color='prominent'>
                    {title}
                </Text>
                <div
                    className='cashier-onboarding-card__container'
                    data-testid='dt_cashier_onboarding_card'
                    onClick={onClick}
                >
                    <div className='cashier-onboarding-card__content'>
                        <Text
                            size={is_mobile_or_tablet ? 'xxs' : 'xs'}
                            className='cashier-onboarding-card__description'
                        >
                            {description}
                        </Text>
                        <Icon icon={is_dark_mode_on ? 'IcChevronRightBoldDark' : 'IcChevronRightBold'} size={16} />
                    </div>
                    {children}
                </div>
            </div>
        );
    }
);

export default CashierOnboardingCard;
