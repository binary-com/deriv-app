import React from 'react';
import { Localize } from '@deriv/translations';
import AccountArticle from '../article';

const ApiTokenArticle = () => (
    <AccountArticle
        title={<Localize i18n_default_text='API token' />}
        descriptions={[
            <Localize
                key={0}
                i18n_default_text="To access your mobile apps and other third-party apps, you'll first need to generate an API token."
            />,
        ]}
    />
);

export default ApiTokenArticle;
