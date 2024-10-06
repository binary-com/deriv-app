import React from 'react';
import { useHistory } from 'react-router-dom';
import { Icon, Checklist, StaticUrl, Text } from '@deriv/components';
import { useIsTNCNeeded } from '@deriv/hooks';
import { Localize, localize } from '@deriv/translations';
import { routes, WS } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import CashierLocked from '../../../components/cashier-locked';

type TItems = {
    button_text?: string;
    onClick: () => void;
    status: string;
    is_disabled?: boolean;
    content: string | JSX.Element;
};

const DepositLocked = observer(() => {
    const { client } = useStore();
    const {
        account_status,
        is_financial_account,
        is_financial_information_incomplete,
        is_trading_experience_incomplete,
        is_virtual,
        updateAccountStatus,
    } = client;

    // handle authentication locked
    const identity = account_status?.authentication?.identity;
    const document = account_status?.authentication?.document;
    const needs_verification = account_status?.authentication?.needs_verification;
    const is_poi_needed = needs_verification?.includes('identity');
    const is_poa_needed = needs_verification?.includes('document');
    const has_poi_submitted = identity?.status !== 'none';
    const has_poa_submitted = document?.status !== 'none';
    const history = useHistory();
    const is_tnc_needed = useIsTNCNeeded();

    // handle TnC
    const acceptTnc = async () => {
        await WS.tncApproval();
        await WS.getSettings();

        if (!is_virtual && !account_status?.status?.includes('deposit_attempt')) {
            await updateAccountStatus();
        }
    };

    // handle all deposits lock status
    const items: TItems[] = [
        ...(is_poi_needed && has_poi_submitted
            ? [
                  {
                      content: localize('Check proof of identity document verification status'),
                      status: 'action',
                      onClick: () => history.push(routes.proof_of_identity),
                  },
              ]
            : []),
        ...(is_poa_needed && has_poa_submitted
            ? [
                  {
                      content: localize('Check proof of address document verification status'),
                      status: 'action',
                      onClick: () => history.push(routes.proof_of_address),
                  },
              ]
            : []),
        ...(is_tnc_needed
            ? [
                  {
                      content: (
                          <Localize
                              i18n_default_text='Accept our updated <0>terms and conditions</0>'
                              components={[
                                  <StaticUrl
                                      key={0}
                                      className='link'
                                      href='terms-and-conditions'
                                      is_document={false}
                                  />,
                              ]}
                          />
                      ),
                      status: 'button-action',
                      onClick: () => acceptTnc(),
                      button_text: localize('I accept'),
                  },
              ]
            : []),
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
        <>
            {items.length ? (
                <div className='cashier-locked'>
                    <Icon icon='IcCashierDepositLock' className='cashier-locked__icon' />
                    <Text as='h2' weight='bold' align='center' className='cashier-locked__title'>
                        {localize('Deposits are locked')}
                    </Text>

                    <Text as='p' align='center' size='xs' className='cashier-locked__desc'>
                        {localize('To enable this feature you must complete the following:')}
                    </Text>
                    <Checklist className='cashier-locked__checklist' items={items} />
                </div>
            ) : (
                <CashierLocked />
            )}
        </>
    );
});

export default DepositLocked;
