import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useFormikContext } from 'formik';
import SelfExclusionContext from './self-exclusion-context';

const SelfExclusionConfirmLimits = () => {
    const { backToReview } = React.useContext(SelfExclusionContext);
    const { handleSubmit, isSubmitting } = useFormikContext();

    return (
        <div className='da-self-exclusion__confirm-limits'>
            <Icon icon='IcStop' className='da-self-exclusion__confirm-limits-image' />
            <Text
                as='h4'
                align='center'
                color='prominent'
                className='da-self-exclusion__confirm-limits-header'
                line_height='l'
                size='s'
                weight='bold'
            >
                <Localize i18n_default_text='Save new limits?' />
            </Text>
            <Text
                as='p'
                align='center'
                color='general'
                className='da-self-exclusion__confirm-limits-desc'
                line_height='m'
                size='xs'
            >
                <Localize i18n_default_text='Remember: You cannot log in to your account until the selected date.' />
            </Text>
            <div className='da-self-exclusion__confirm-limits-buttons'>
                <Button type='button' secondary large onClick={backToReview}>
                    <Localize i18n_default_text='No, review my limits' />
                </Button>
                <Button
                    type='submit'
                    is_loading={isSubmitting}
                    is_disabled={isSubmitting}
                    primary
                    large
                    onClick={() => handleSubmit()}
                >
                    <Localize i18n_default_text='Yes, log me out immediately' />
                </Button>
            </div>
        </div>
    );
};

export default SelfExclusionConfirmLimits;
