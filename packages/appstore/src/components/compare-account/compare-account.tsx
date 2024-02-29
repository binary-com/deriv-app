import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';

type TCompareAccount = {
    accounts_sub_text: string;
    is_desktop?: boolean;
};

const CompareAccount = ({ accounts_sub_text, is_desktop }: TCompareAccount) => {
    const history = useHistory();
    return (
        <div
            className='cfd-accounts__compare-table-title'
            onClick={() => {
                history.push(routes.compare_cfds);
            }}
        >
            <Text
                size={is_desktop ? 'xxs' : 'xs'}
                color='red'
                weight='bold'
                line_height='s'
                styles={is_desktop ? { marginInlineStart: '1rem' } : ''}
            >
                <Localize i18n_default_text={accounts_sub_text} />
            </Text>
        </div>
    );
};

export default CompareAccount;
