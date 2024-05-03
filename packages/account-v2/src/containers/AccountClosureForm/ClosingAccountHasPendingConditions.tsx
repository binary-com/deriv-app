import React from 'react';
import { useAllAccountsList } from '@deriv/api-v2';
import { Loader, Text } from '@deriv-com/ui';
import { TAccountClosureError } from 'src/types';
import { getDTraderPendingAccountDetails } from 'src/utils';

type TClosingAccountHasPendingConditionsProps = {
    error: TAccountClosureError;
};

export const ClosingAccountHasPendingConditions = ({ error }: TClosingAccountHasPendingConditionsProps) => {
    const { data: accountList, isLoading } = useAllAccountsList();

    if (isLoading) {
        return <Loader is_fullscreen={false} />;
    }

    const { dtrade } = accountList;
    // [TODO] - Add remaining conditions
    if ('balance' in error.details) {
        return (
            <div>
                <Text as='p' size='sm' weight='bold'>
                    Please withdraw your funds from the following Deriv account(s):
                </Text>
                <div>{JSON.stringify(getDTraderPendingAccountDetails(dtrade))}</div>
            </div>
        );
    }
    // [TODO] - Remove Default case
    return (
        <div>
            <Text as='p' size='xs' weight='bold'>
                Default case
            </Text>
        </div>
    );
};
