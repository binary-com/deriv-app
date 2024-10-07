import type { Modals } from 'Constants/modals';

export type TModals = typeof Modals;

export type TModalKeys = keyof TModals;

export type TModalProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [T in TModalKeys]: Parameters<TModals[T]>[0] extends { [key: string]: any }
        ? Parameters<TModals[T]>[0]
        : Record<string, never>;
};

/**
 * TModal type represents a specific modal type, with its prop typing constrained to that specific modal based on its key.
 */
export type TModal<T extends TModalKeys> = {
    key: T;
    props: TModalProps[T];
};

/**
 * TModalVariants type represents the union of all possible modal keys and prop types.
 * This type is necessary for typing a function or generic argument that could accept any type of modal.
 */
export type TModalVariants = {
    key: TModalKeys;
    props: TModalProps[TModalKeys];
};

export type TModalManagerContext = {
    hideModal: (options?: THideModalOptions | React.MouseEvent<HTMLElement, MouseEvent>) => void;
    is_modal_open: boolean;
    isCurrentModal: (...keys: TModalKeys[]) => boolean;
    modal_props: Map<TModalKeys, TModalProps[TModalKeys]>;
    modal: TModalVariants | null;
    previous_modal?: TModalVariants | null;
    stacked_modal?: TModalVariants | null;
    showModal: <T extends TModalKeys>(modal: TModal<T>, options?: TShowModalOptions) => void;
    useRegisterModalProps: <T extends TModalKeys>(modals: TModal<T> | TModalVariants[]) => void;
};

export type TShowModalOptions = {
    should_stack_modal?: boolean;
};

export type THideModalOptions = {
    should_save_form_history?: boolean;
    should_hide_all_modals?: boolean;
    should_restore_local_state?: boolean;
};
