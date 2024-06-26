import React from 'react';
import { Button, Icon, Modal, Text, MobileDialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

type RiskToleranceWarningModalProps = {
    show_risk_modal: boolean;
    handleAcceptRisk: () => void;
    title: string;
    button_text?: string;
    body_content: JSX.Element;
    has_sub_header?: boolean;
};

const RiskToleranceWarningModal = ({
    show_risk_modal,
    handleAcceptRisk,
    title,
    button_text,
    body_content,
    has_sub_header = false,
}: RiskToleranceWarningModalProps) => {
    const { isDesktop } = useDevice();
    return (
        <React.Fragment>
            {isDesktop ? (
                <Modal
                    width='44rem'
                    title={title}
                    height='41rem'
                    is_open={show_risk_modal}
                    className='center-risk-modal'
                    toggleModal={handleAcceptRisk}
                    has_close_icon={false}
                >
                    <Modal.Body>
                        <Icon icon='IcRedWarning' size='63' />
                        <Text as='p' size='xs' align='center' line_height='s' className='risk-acceptance__text'>
                            {body_content}
                        </Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            type='button'
                            large
                            text={button_text ?? localize('OK')}
                            primary
                            onClick={handleAcceptRisk}
                        />
                    </Modal.Footer>
                </Modal>
            ) : (
                <MobileDialog
                    visible={show_risk_modal}
                    title={has_sub_header ? localize('Trading Experience Assessment') : title}
                    portal_element_id='modal_root'
                    has_close_icon={false}
                >
                    <Modal.Body className='risk-tolerance-modal'>
                        {has_sub_header ? (
                            <Text
                                size='xs'
                                line_height='s'
                                weight='bold'
                                as='p'
                                className='risk-tolerance-modal__title'
                            >
                                {title}
                                <div className='risk-tolerance-modal__title--separator' />
                            </Text>
                        ) : null}
                        <div className='risk-tolerance-modal__wrapper'>
                            <Icon icon='IcRedWarning' size='65' />
                            <Text as='p' size='xs' align='center' line_height='l' className='risk-acceptance__text'>
                                {body_content}
                            </Text>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className='risk-tolerance-modal__footer'>
                        <Button
                            type='button'
                            large
                            text={button_text ?? localize('OK')}
                            primary
                            onClick={handleAcceptRisk}
                        />
                    </Modal.Footer>
                </MobileDialog>
            )}
        </React.Fragment>
    );
};

export default RiskToleranceWarningModal;
