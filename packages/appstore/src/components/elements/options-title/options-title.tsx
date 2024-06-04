import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

type TOptionsTitle = {
    is_eu_user: boolean;
};

const OptionsTitle = observer(({ is_eu_user }: TOptionsTitle) => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    if (is_mobile) return null;
    return is_eu_user ? (
        <Text size='sm' weight='bold' color='prominent'>
            <Localize i18n_default_text='Multipliers' />
        </Text>
    ) : (
        <Text size='sm' weight='bold' color='prominent'>
            <Localize i18n_default_text='Options' />
        </Text>
    );
});

export default OptionsTitle;
