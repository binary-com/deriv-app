import { Button, Text } from '@deriv/components';
import { Localize, useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { useHistory } from 'react-router';
import { routes } from '@deriv/shared';
import FormFooter from '../../../Components/form-footer';
import { DerivLightOrdersDefaultIcon } from '@deriv/quill-icons';
import { observer, useStore } from '@deriv/stores';
import './navigate-to-personal-details.scss';

const NavigateToPersonalDetails = observer(() => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const { ui, client } = useStore();
    const history = useHistory();

    const { account_settings } = client;

    const handleOnclick = () => {
        let field_to_scroll;

        if (!account_settings.account_opening_reason) {
            field_to_scroll = 'account-opening-reason';
        } else {
            field_to_scroll = 'employment-tax-section';
        }

        ui.setFieldRefToFocus(field_to_scroll);
        history.push(routes.personal_details);
    };

    const icon_size = isDesktop ? { height: '200px', width: '200px' } : { height: '124px', width: '124px' };

    return (
        <div className='navigate-to-personal-details'>
            <div className='navigate-to-personal-details__body'>
                <DerivLightOrdersDefaultIcon {...icon_size} />
                <Text
                    as='p'
                    size={isDesktop ? 'sm' : 's'}
                    className='navigate-to-personal-details__body--text'
                    align='center'
                >
                    <Localize i18n_default_text='Update your personal details in account settings before starting your financial assessment.' />
                </Text>
            </div>
            {isDesktop ? (
                <div className='navigate-to-personal-details__footer'>
                    <Button
                        type='button'
                        has_effect
                        text={localize('Update now')}
                        primary
                        large
                        onClick={handleOnclick}
                    />
                </div>
            ) : (
                <FormFooter className='navigate-to-personal-details__footer--layout'>
                    <Button
                        onClick={handleOnclick}
                        has_effect
                        is_loading={false}
                        text={localize('Update now')}
                        large
                        primary
                    />
                </FormFooter>
            )}
        </div>
    );
});

export default NavigateToPersonalDetails;
