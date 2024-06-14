import React from 'react';
import { DesktopWrapper, Icon, MobileOrTabletWrapper, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import PageReturn from 'Components/page-return';
import { useStores } from 'Stores';

type TFilterModalHeaderProps = {
    pageHeaderReturnFn: () => void;
};

const FilterModalHeader = ({ pageHeaderReturnFn }: TFilterModalHeaderProps) => {
    const { buy_sell_store } = useStores();
    const { show_filter_payment_methods } = buy_sell_store;

    if (show_filter_payment_methods) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <PageReturn
                        className='filter-modal-header'
                        onClick={pageHeaderReturnFn}
                        page_title={localize('Payment methods')}
                    />
                </DesktopWrapper>
                <MobileOrTabletWrapper>
                    <Text align='center' weight='bold'>
                        <Icon
                            className='filter-modal-header__return-button'
                            icon='IcArrowLeftBold'
                            onClick={pageHeaderReturnFn}
                        />
                        <Localize i18n_default_text='Payment methods' />
                    </Text>
                </MobileOrTabletWrapper>
            </React.Fragment>
        );
    }

    return <Localize i18n_default_text='Filter' />;
};

export default observer(FilterModalHeader);
