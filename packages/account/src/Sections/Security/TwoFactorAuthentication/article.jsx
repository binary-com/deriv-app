import React from 'react';
import { localize, Localize } from '@deriv/translations';
import Article from 'Components/article';

const TFAArticle = () => (
    <Article
        title={localize('Two-factor authentication (2FA)')}
        descriptions={[
            <Localize
                key={0}
                i18n_default_text='Protect your account with 2FA. Each time you log in to your account, you will need to enter your password and an authentication code generated by a 2FA app on your smartphone.'
            />,
        ]}
    />
);

export default TFAArticle;
