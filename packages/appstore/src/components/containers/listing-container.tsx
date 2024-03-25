import React, { HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { TWalletAccount } from 'Types';
import CurrencySwitcherCard from 'Components/currency-switcher-card';
import GridContainer from 'Components/containers/grid-container';
import TitleCardLoader from 'Components/pre-loader/title-card-loader';
import './listing-container.scss';

type TListingContainerProps = {
    title: ReactNode;
    description: ReactNode;
    is_deriv_platform?: boolean;
    wallet_account?: TWalletAccount;
    className?: string;
    is_outside_grid_container?: boolean;
};
type TOptionsProps = Pick<TListingContainerProps, 'title' | 'description' | 'is_deriv_platform'>;
type TSwitcherProps = Pick<TListingContainerProps, 'wallet_account' | 'is_deriv_platform'>;

const Options = observer(({ title, description, is_deriv_platform }: TOptionsProps) => {
    const {
        client: { is_landing_company_loaded },
    } = useStore();

    if (is_landing_company_loaded || !is_deriv_platform) {
        return (
            <div className='listing-container__title'>
                {title}
                {description}
            </div>
        );
    }

    return <TitleCardLoader />;
});

const Switcher = ({ is_deriv_platform }: TSwitcherProps) => {
    if (!is_deriv_platform) return null;
    return <CurrencySwitcherCard />;
};

const ListingContainer = ({
    title,
    description,
    is_deriv_platform = false,
    is_outside_grid_container,
    wallet_account,
    children,
    className,
}: TListingContainerProps & Omit<HTMLAttributes<HTMLDivElement>, 'title'>) => {
    return (
        <div className={classNames('listing-container', className)}>
            <div className='listing-container__top-container'>
                <Options title={title} description={description} is_deriv_platform={is_deriv_platform} />
                <Switcher wallet_account={wallet_account} is_deriv_platform={is_deriv_platform} />
            </div>
            {is_outside_grid_container ? children : <GridContainer>{children}</GridContainer>}
        </div>
    );
};

export default ListingContainer;
