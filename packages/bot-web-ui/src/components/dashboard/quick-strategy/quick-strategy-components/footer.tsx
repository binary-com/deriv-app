import React from 'react';
import { Button } from '@deriv/components';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { TQuickStrategyFooter } from './components.types';

const QuickStrategyFooter = ({
    is_onscreen_keyboard_active,
    is_submit_enabled,
    is_stop_button_visible,
    setFieldValue,
    submitForm,
    setActiveTab,
}: TQuickStrategyFooter) => {
    function handleCreateEdit() {
        setFieldValue('button', 'edit');
        submitForm();
        setActiveTab(1);
    }
    function handleRun() {
        setActiveTab(1);
        setFieldValue('button', 'run');
        submitForm();
    }
    return (
        <div
            className={classNames('quick-strategy__form-footer', {
                'quick-strategy__form-footer--active-keyboard': is_onscreen_keyboard_active,
            })}
        >
            <Button.Group>
                <Button
                    type='button'
                    id='db-quick-strategy__button-edit'
                    text={localize('Create and edit')}
                    is_disabled={!is_submit_enabled}
                    secondary
                    large
                    onClick={handleCreateEdit}
                />
                <Button
                    type='button'
                    id='db-quick-strategy__button-run'
                    text={localize('Run')}
                    is_disabled={!is_submit_enabled || is_stop_button_visible}
                    primary
                    large
                    onClick={handleRun}
                />
            </Button.Group>
        </div>
    );
};

export default React.memo(QuickStrategyFooter);
