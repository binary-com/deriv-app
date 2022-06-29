import React from 'react';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { Icon, Checklist, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { RootStore } from 'Types';

type TAccountTransferLocked = {
    is_financial_account: boolean;
    is_financial_information_incomplete: boolean;
    is_trading_experience_incomplete: boolean;
};

const AccountTransferLocked = ({
    is_financial_account,
    is_financial_information_incomplete,
    is_trading_experience_incomplete,
}: TAccountTransferLocked) => {
    const history = useHistory();
    const items = [
        ...(is_financial_account && (is_financial_information_incomplete || is_trading_experience_incomplete)
            ? [
                  {
                      content: localize('Complete the financial assessment form'),
                      status: 'action',
                      onClick: () => history.push(routes.financial_assessment),
                  },
              ]
            : []),
    ];
    return (
        <div className='cashier-locked'>
            <Icon icon='IcMoneyTransfer' className='cashier-locked__icon' />
            <Text as='h2' weight='bold' align='center' className='cashier-locked__title'>
                {localize('Transfers are locked')}
            </Text>
            <React.Fragment>
                <p className='cashier-locked__desc'>
                    {localize('To enable this feature you must complete the following:')}
                </p>
                <Checklist className='cashier-locked__checklist' items={items} />
            </React.Fragment>
        </div>
    );
};

export default connect(({ client }: RootStore) => ({
    is_financial_account: client.is_financial_account,
    is_financial_information_incomplete: client.is_financial_information_incomplete,
    is_trading_experience_incomplete: client.is_trading_experience_incomplete,
}))(AccountTransferLocked);
