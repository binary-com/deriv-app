import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TReadyToUpdateWalletsProps } from './ready-to-update-wallets';
import UpgradeInformationList from './upgrade-info-list';
import WalletsImage from 'Assets/svgs/wallets';

const ReadyToUpgradeForm = ({ is_eu, is_high_risk }: TReadyToUpdateWalletsProps) => (
    <React.Fragment>
        <WalletsImage banner={'ReadyToUpdateWalletsIcon'} />
        <div className='wallet-wrapper--text'>
            <Text size='m' align='center' weight='bold' line_height='l'>
                <Localize i18n_default_text='Ready to upgrade?' />
            </Text>
            <Text align='center' line_height='l'>
                <Localize
                    i18n_default_text="This is <0>irreversible.</0> Once you upgrade, the Cashier won't be available anymore. You'll need to
                use Wallets to deposit, withdraw, and transfer funds."
                    components={<Text weight='bold' align='center' line_height='l' key={0} />}
                />
            </Text>
        </div>
        <div className='wallet-wrapper--info-section'>
            <UpgradeInformationList is_eu={is_eu} is_high_risk={is_high_risk} />
        </div>
    </React.Fragment>
);

export default ReadyToUpgradeForm;
