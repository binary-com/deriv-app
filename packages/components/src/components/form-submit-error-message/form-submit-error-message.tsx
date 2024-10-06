import React from 'react';
import classNames from 'classnames';
import Icon from '../icon/icon';
import Text from '../text';

type TFormSubmitErrorMessage = {
    className?: string;
    message: React.ReactNode;
    weight?: string;
    text_color?: string;
};

const FormSubmitErrorMessage = ({
    className,
    message,
    text_color = 'prominent',
    weight = 'bold',
}: TFormSubmitErrorMessage) => {
    return (
        <div className={classNames('dc-form-submit-error-message', className)}>
            <Icon icon='IcAlertDanger' data_testid='form_submit_error' />
            {
                <Text as='p' size='xxs' weight={weight} color={text_color}>
                    {message}
                </Text>
            }
        </div>
    );
};

export default FormSubmitErrorMessage;
