import React from 'react';
import ContractCardDialog from './contract-card-dialog';
import ContractUpdateForm, { TGeneralContractCardBodyProps } from './contract-update-form';
import Icon from '../../icon';
import MobileDialog from '../../mobile-dialog';
import Popover from '../../popover';
import Div100vhContainer from '../../div100vh-container';
import './sass/contract-card-dialog.scss';
import { useDevice } from '@deriv-com/ui';

export type TToggleCardDialogProps = Pick<
    TGeneralContractCardBodyProps,
    | 'addToast'
    | 'current_focus'
    | 'error_message_alignment'
    | 'getCardLabels'
    | 'getContractById'
    | 'onMouseLeave'
    | 'removeToast'
    | 'setCurrentFocus'
> & {
    contract_id?: number;
    is_valid_to_cancel?: boolean;
    should_show_cancellation_warning?: boolean;
    toggleCancellationWarning?: () => void;
    is_accumulator?: boolean;
    is_turbos?: boolean;
    totalProfit: number;
};

const ToggleCardDialog = ({
    addToast,
    contract_id,
    getCardLabels,
    getContractById,
    is_valid_to_cancel,
    should_show_cancellation_warning,
    toggleCancellationWarning,
    ...passthrough_props
}: TToggleCardDialogProps) => {
    const [is_visible, setIsVisible] = React.useState(false);
    const [top, setTop] = React.useState(0);
    const [left, setLeft] = React.useState(0);
    const { isDesktop } = useDevice();
    const toggle_ref = React.useRef<HTMLButtonElement>(null);
    const dialog_ref = React.useRef<HTMLDivElement>(null);
    const contract = getContractById(Number(contract_id));

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

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const onPopoverClose = () => {
        toggleCancellationWarning?.();
    };

    const toggleDialog = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDesktop && should_show_cancellation_warning && is_valid_to_cancel) {
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
            color={is_valid_to_cancel ? 'disabled' : ''}
            size={12}
        />
    );

    return (
        <div onClick={handleClick}>
            {is_valid_to_cancel && should_show_cancellation_warning && isDesktop ? (
                <Popover
                    alignment='right'
                    classNameBubble='dc-contract-card-dialog__popover-bubble'
                    className='dc-contract-card-dialog__popover'
                    is_bubble_hover_enabled
                    margin={2}
                    zIndex='2'
                    message={getCardLabels().TAKE_PROFIT_LOSS_NOT_AVAILABLE}
                    onBubbleClose={onPopoverClose}
                >
                    <button ref={toggle_ref} className='dc-contract-card-dialog-toggle' onClick={toggleDialogWrapper}>
                        {edit_icon}
                    </button>
                </Popover>
            ) : (
                <button ref={toggle_ref} className='dc-contract-card-dialog-toggle' onClick={toggleDialogWrapper}>
                    {edit_icon}
                </button>
            )}
            {isDesktop ? (
                <ContractCardDialog
                    ref={dialog_ref}
                    is_visible={is_visible}
                    left={left}
                    top={top}
                    toggle_ref={toggle_ref}
                    toggleDialog={toggleDialogWrapper}
                >
                    <ContractUpdateForm
                        addToast={addToast}
                        contract={contract}
                        getCardLabels={getCardLabels}
                        getContractById={getContractById}
                        toggleDialog={toggleDialogWrapper}
                        {...passthrough_props}
                    />
                </ContractCardDialog>
            ) : (
                <MobileDialog
                    portal_element_id='modal_root'
                    visible={is_visible}
                    onClose={toggleDialogWrapper}
                    wrapper_classname='contract-update'
                >
                    <Div100vhContainer className='contract-update__wrapper' height_offset='40px'>
                        <ContractUpdateForm
                            addToast={addToast}
                            contract={contract}
                            getCardLabels={getCardLabels}
                            getContractById={getContractById}
                            isMobile
                            toggleDialog={toggleDialogWrapper}
                            {...passthrough_props}
                        />
                    </Div100vhContainer>
                </MobileDialog>
            )}
        </div>
    );
};

ToggleCardDialog.displayName = 'ToggleCardDialog';

export default React.memo(ToggleCardDialog);
