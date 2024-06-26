import React from 'react';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import { FormikConsumer } from 'formik';
import { Button, Icon, Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from '../icon-message-content';
import { useDevice } from '@deriv-com/ui';

type TLeaveConfirmMessage = {
    back: () => void;
    leave: () => void;
};
type TTransitionBlocker = RouteComponentProps & {
    dirty: boolean;
    onDirty?: (prop: boolean) => void;
};

const LeaveConfirmMessage = ({ back, leave }: TLeaveConfirmMessage) => {
    const { isMobile } = useDevice();

    return (
        <IconMessageContent
            className='leave-confirm'
            message={localize('Unsaved changes')}
            text={localize('You have unsaved changes. Are you sure you want to discard changes and leave this page?')}
            icon={<Icon icon='IcUnsavedChanges' size={isMobile ? 93 : 128} data_testid='dt_unsaved_changes_icon' />}
            is_disabled_for_mobile={true}
        >
            <div className='account-management-flex-wrapper account-management-leave-confirm'>
                <Button type='button' has_effect onClick={back} text={localize('Cancel')} secondary large={isMobile} />
                <Button
                    type='button'
                    has_effect
                    onClick={leave}
                    text={localize('Leave Settings')}
                    primary
                    large={isMobile}
                />
            </div>
        </IconMessageContent>
    );
};
/**
 * Blocks routing if Formik form is dirty
 * Has to be a child of <Formik> for FormikConsumer to work
 */
export const TransitionBlocker = ({ dirty, onDirty }: TTransitionBlocker) => {
    const [show, setShow] = React.useState(false);
    const [next_location, setNextLocation] = React.useState<{ pathname: string } | null>(null);
    const history = useHistory();
    const { isMobile } = useDevice();

    React.useEffect(() => {
        return () => unblock();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const unblock = history.block((location: { pathname: string }) => {
        if (dirty) {
            if (onDirty) onDirty(false);
            if (show) leave();
            setShow(true);
            setNextLocation(location);
        }
        return !dirty;
    });
    const leave = () => {
        if (next_location?.pathname) {
            const { pathname } = next_location;
            unblock();
            history.push(pathname);
        } else history.push(null);
    };
    const back = () => {
        setNextLocation(null);
        setShow(false);
        if (onDirty) onDirty(true);
    };

    return (
        <>
            {show && isMobile ? (
                <LeaveConfirmMessage back={back} leave={leave} />
            ) : (
                <Modal is_open={show} small toggleModal={back}>
                    <Modal.Body>
                        <LeaveConfirmMessage back={back} leave={leave} />
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};
export const TransitionBlockerWithRouter = withRouter(TransitionBlocker);
const LeaveConfirm = ({ onDirty }: { onDirty?: (prop: boolean) => void }) => (
    <FormikConsumer>
        {formik => <TransitionBlockerWithRouter onDirty={onDirty} dirty={formik.dirty && formik.submitCount === 0} />}
    </FormikConsumer>
);
export default LeaveConfirm;
