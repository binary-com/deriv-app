import React from 'react';
import { Localize, localize } from '@deriv/translations';
import AccountArticle from 'Components/article';

const getDescription = () => [
    <Localize key={0} i18n_default_text='These are default limits that we apply to your accounts.' />,
];

const AccountLimitsArticle = () => (
    <AccountArticle title={localize('Account limits')} descriptions={getDescription()} />
);

export default AccountLimitsArticle;
