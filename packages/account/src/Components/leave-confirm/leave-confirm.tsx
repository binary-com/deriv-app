import React from 'react';
import { RouteComponentProps, useHistory, withRouter, useLocation } from 'react-router-dom';
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

export const TransitionBlocker = ({ dirty, onDirty }: TTransitionBlocker) => {
    const [showModal, setShowModal] = React.useState(false);
    const history = useHistory();
    const location = useLocation();
    const { isMobile } = useDevice();
    const [nextLocation, setNextLocation] = React.useState<string | null>(location.pathname);
    React.useEffect(() => {
        const unblock = history.block((location: Location) => {
            if (dirty && !showModal) {
                if (onDirty) onDirty(false);
                setNextLocation(location.pathname);
                setShowModal(true);
                return false;
            }
            return true;
        });
        return () => unblock();
    }, [dirty, showModal, history, onDirty]);
    const leave = React.useCallback(() => {
        if (nextLocation) {
            setShowModal(false);
            history.push(nextLocation);
            if (onDirty) {
                onDirty(false);
            }
        }
    }, [nextLocation, history, onDirty]);

    const back = () => {
        setShowModal(false);
        if (onDirty) {
            onDirty(true);
        }
    };

    return (
        <>
            {showModal && isMobile ? (
                <LeaveConfirmMessage back={back} leave={leave} />
            ) : (
                <Modal is_open={showModal} small toggleModal={back}>
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
