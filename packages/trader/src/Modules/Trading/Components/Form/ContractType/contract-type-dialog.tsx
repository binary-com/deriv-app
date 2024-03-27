import React from 'react';
import { MobileDialog } from '@deriv/components';
import { useDevice } from '@deriv/hooks';
import { Header } from './ContractTypeInfo';
import { localize } from '@deriv/translations';
import ContractTypeMenu from './ContractTypeMenu';

type TContractTypeDialog = {
    is_info_dialog_open: boolean;
    onClose: () => void;
    is_open: boolean;
    learn_more_banner?: React.ReactNode;
    hide_back_button?: boolean;
    title?: string;
};

type TContractTypeDialogProps = Pick<
    React.ComponentProps<typeof ContractTypeMenu>,
    | 'selected'
    | 'categories'
    | 'info_banner'
    | 'onBackButtonClick'
    | 'onChangeInput'
    | 'onCategoryClick'
    | 'onSearchBlur'
    | 'show_loading'
    | 'item'
> &
    TContractTypeDialog;

const ContractTypeDialog = ({
    categories,
    children,
    info_banner,
    is_info_dialog_open,
    is_open,
    item,
    selected,
    title,
    onBackButtonClick,
    onCategoryClick,
    onChangeInput,
    onClose,
    onSearchBlur,
    show_loading,
    learn_more_banner,
    hide_back_button,
}: React.PropsWithChildren<TContractTypeDialogProps>) => {
    const { isMobile } = useDevice();
    const current_mobile_title = is_info_dialog_open ? (
        <Header
            title={title || item?.text || ''}
            onClickBack={onBackButtonClick}
            text_size='xs'
            should_render_arrow={!hide_back_button}
        />
    ) : (
        localize('Trade types')
    );

    if (isMobile) {
        return (
            <React.Fragment>
                <span className='contract-type-widget__select-arrow' />
                <MobileDialog
                    info_banner={is_info_dialog_open ? '' : info_banner}
                    portal_element_id='modal_root'
                    title={current_mobile_title}
                    header_classname='contract-type-widget__header'
                    wrapper_classname={is_info_dialog_open ? 'contracts-modal-info' : 'contracts-modal-list'}
                    visible={is_open}
                    onClose={onClose}
                    has_content_scroll={!is_info_dialog_open}
                    learn_more_banner={is_info_dialog_open ? '' : learn_more_banner}
                >
                    {children}
                </MobileDialog>
            </React.Fragment>
        );
    }

    return (
        <ContractTypeMenu
            info_banner={info_banner}
            is_info_dialog_open={is_info_dialog_open}
            is_open={is_open}
            item={item}
            selected={selected}
            categories={categories}
            onSearchBlur={onSearchBlur}
            onClose={onClose}
            onBackButtonClick={onBackButtonClick}
            onChangeInput={onChangeInput}
            onCategoryClick={onCategoryClick}
            show_loading={show_loading}
            learn_more_banner={learn_more_banner}
            hide_back_button={hide_back_button}
            title={title}
        >
            {children}
        </ContractTypeMenu>
    );
};

export default ContractTypeDialog;
