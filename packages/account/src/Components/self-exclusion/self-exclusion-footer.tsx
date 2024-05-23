import React from 'react';
import { createPortal } from 'react-dom';
import { useFormikContext } from 'formik';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import SelfExclusionContext from './self-exclusion-context';

const SelfExclusionFooter = () => {
    const { footer_ref, goToConfirm, toggleArticle } = React.useContext(SelfExclusionContext);
    const { dirty, isSubmitting, isValid, values } = useFormikContext();

    if (footer_ref) {
        return createPortal(
            <>
                <a className='link link--prominent' onClick={toggleArticle}>
                    <Text size='xxs' line_height='m' weight='bold'>
                        <Localize i18n_default_text='Learn more about trading limits' />
                    </Text>
                </a>
                <Button
                    disabled={!dirty || !isValid || isSubmitting}
                    primary
                    className='da-self-exclusion__button'
                    large
                    onClick={() => goToConfirm?.(values)}
                    type='button'
                >
                    <Localize i18n_default_text='Next' />
                </Button>
            </>,
            footer_ref
        );
    }

    return null;
};

export default SelfExclusionFooter;
