import React from 'react';
import PropTypes from 'prop-types';
import { isDesktop, isMobile } from '@deriv/shared';
import ContractCardDialog from './contract-card-dialog.jsx';
import ContractUpdateForm from './contract-update-form.jsx';
import PopoverMessageCheckbox from '../../popover-message-checkbox';
import Icon from '../../icon';
import DesktopWrapper from '../../desktop-wrapper';
import MobileDialog from '../../mobile-dialog';
import MobileWrapper from '../../mobile-wrapper';
import Popover from '../../popover';
import Div100vhContainer from '../../div100vh-container';
import './sass/contract-card-dialog.scss';

let ContractUpdateFormWrapper;

const ToggleCardDialog = ({
    addToast,
    connectWithContractUpdate,
    contract_id,
    current_focus,
    error_message_alignment,
    getCardLabels,
    getContractById,
    is_valid_to_cancel,
    onMouseLeave,
    removeToast,
    setCurrentFocus,
    should_show_cancellation_warning,
    status,
    toggleCancellationWarning,
}) => {
    const [is_visible, setIsVisible] = React.useState(false);
    const [top, setTop] = React.useState(0);
    const [left, setLeft] = React.useState(0);
    const [is_do_not_show_selected, setIsDoNotShowSelected] = React.useState(!should_show_cancellation_warning);

    const toggle_ref = React.useRef();
    const dialog_ref = React.useRef();
    const contract = getContractById(contract_id);
    ContractUpdateFormWrapper =
        ContractUpdateFormWrapper || connectWithContractUpdate?.(ContractUpdateForm) || ContractUpdateForm;

    React.useEffect(() => {
        if (is_visible && toggle_ref?.current && dialog_ref?.current) {
            const icon_bound = toggle_ref.current.getBoundingClientRect();
            const target_bound = dialog_ref.current.getBoundingClientRect();
            const body_bound = document.body.getBoundingClientRect();

            let { top: icon_bound_top } = icon_bound;
            const { right } = icon_bound;

            if (icon_bound_top + target_bound?.height > body_bound.height) {
                icon_bound_top -= target_bound?.height - icon_bound.height;
            }

            if (right + target_bound?.width > body_bound.width) {
                setLeft(right - target_bound?.width - 16);
            } else {
                setLeft(right - 16);
            }
            setTop(icon_bound_top);
        }
    }, [is_visible]);

    const handleClick = e => {
        e.stopPropagation();
    };

    const onPopoverClose = () => {
        if (is_do_not_show_selected) {
            toggleCancellationWarning();
        }
    };

    const onPopoverCheckboxChange = () => {
        setIsDoNotShowSelected(!is_do_not_show_selected);
    };

    const toggleDialog = e => {
        e.preventDefault();
        e.stopPropagation();
        if (isMobile() && should_show_cancellation_warning && is_valid_to_cancel) {
            addToast({
                key: 'deal_cancellation_active',
                content: getCardLabels().TAKE_PROFIT_LOSS_NOT_AVAILABLE,
                type: 'error',
            });
        }

        if (is_valid_to_cancel) return;

        setIsVisible(!is_visible);
    };

    const toggleDialogWrapper = React.useCallback(toggleDialog, [toggleDialog]);

    const edit_icon = (
        <Icon
            className='dc-contract-card-dialog-toggle__icon'
            icon='IcEdit'
            color={is_valid_to_cancel && 'disabled'}
            size={12}
        />
    );

    const toggle_wrapper =
        should_show_cancellation_warning && isDesktop() ? (
            <Popover
                alignment='right'
                classNameBubble='dc-contract-card-dialog__popover'
                is_bubble_hover_enabled
                margin={2}
                zIndex={2}
                message={
                    <PopoverMessageCheckbox
                        defaultChecked={is_do_not_show_selected}
                        checkboxLabel={getCardLabels().DONT_SHOW_THIS_AGAIN}
                        message={getCardLabels().TAKE_PROFIT_LOSS_NOT_AVAILABLE}
                        name='should_show_cancellation_warning'
                        onChange={onPopoverCheckboxChange}
                    />
                }
                onBubbleClose={onPopoverClose}
            >
                <div className='dc-contract-card-dialog-toggle__wrapper'>{edit_icon}</div>
            </Popover>
        ) : (
            <div className='dc-contract-card-dialog-toggle__wrapper'>{edit_icon}</div>
        );

    return (
        <div onClick={handleClick}>
            <div ref={toggle_ref} className='dc-contract-card-dialog-toggle' onClick={toggleDialogWrapper}>
                {is_valid_to_cancel ? toggle_wrapper : edit_icon}
            </div>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='modal_root'
                    visible={is_visible}
                    onClose={toggleDialogWrapper}
                    wrapper_classname='contract-update'
                >
                    <Div100vhContainer className='contract-update__wrapper' height_offset='40px'>
                        <ContractUpdateFormWrapper
                            addToast={addToast}
                            contract={contract}
                            current_focus={current_focus}
                            error_message_alignment={error_message_alignment}
                            getCardLabels={getCardLabels}
                            getContractById={getContractById}
                            onMouseLeave={onMouseLeave}
                            removeToast={removeToast}
                            setCurrentFocus={setCurrentFocus}
                            status={status}
                            toggleDialog={toggleDialogWrapper}
                        />
                    </Div100vhContainer>
                </MobileDialog>
            </MobileWrapper>
            <DesktopWrapper>
                <ContractCardDialog
                    ref={dialog_ref}
                    is_visible={is_visible}
                    left={left}
                    top={top}
                    toggle_ref={toggle_ref}
                    toggleDialog={toggleDialogWrapper}
                >
                    <ContractUpdateFormWrapper
                        addToast={addToast}
                        contract={contract}
                        current_focus={current_focus}
                        error_message_alignment={error_message_alignment}
                        getCardLabels={getCardLabels}
                        getContractById={getContractById}
                        onMouseLeave={onMouseLeave}
                        removeToast={removeToast}
                        setCurrentFocus={setCurrentFocus}
                        status={status}
                        toggleDialog={toggleDialogWrapper}
                    />
                </ContractCardDialog>
            </DesktopWrapper>
        </div>
    );
};

ToggleCardDialog.displayName = 'ToggleCardDialog';

ToggleCardDialog.propTypes = {
    addToast: PropTypes.func,
    connectWithContractUpdate: PropTypes.func,
    contract_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    current_focus: PropTypes.string,
    error_message_alignment: PropTypes.string,
    getCardLabels: PropTypes.func,
    getContractById: PropTypes.func,
    is_valid_to_cancel: PropTypes.bool,
    onMouseLeave: PropTypes.func,
    removeToast: PropTypes.func,
    setCurrentFocus: PropTypes.func,
    should_show_cancellation_warning: PropTypes.bool,
    status: PropTypes.string,
    toggleCancellationWarning: PropTypes.func,
};

export default React.memo(ToggleCardDialog);
