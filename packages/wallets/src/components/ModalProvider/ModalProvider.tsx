import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOnClickOutside } from 'usehooks-ts';
import { MT5AccountType } from '../../features/cfd/screens';
import useDevice from '../../hooks/useDevice';
import { TPlatforms, TMarketTypes } from '../../types';

type TModalState = {
    marketType?: TMarketTypes.All;
    platform?: TPlatforms.All;
};

type TModalContext = {
    getModalState: <T extends keyof TModalState>(key: T) => TModalState[T];
    hide: () => void;
    isOpen: boolean;
    modalState?: Map<keyof TModalState, TModalState[keyof TModalState]>;
    setModalState: <T extends keyof TModalState>(key: T, value: TModalState[T]) => void;
    show: (ModalContent: React.ReactNode) => void;
};

const ModalContext = createContext<TModalContext | null>(null);

export const useModal = () => {
    const context = useContext(ModalContext);

    if (!context) throw new Error('useModal() must be called within a component wrapped in ModalProvider.');

    return context;
};

const ModalProvider = ({ children }: React.PropsWithChildren<unknown>) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<React.ReactNode | null>();
    const [modalState, updateModalState] = useState<Map<keyof TModalState, TModalState[keyof TModalState]>>(new Map());
    const { isDesktop, isMobile } = useDevice();

    const rootRef = useRef<HTMLElement>(document.getElementById('wallets_modal_root'));
    const rootResponsiveRef = useRef<HTMLElement | null>(document.getElementById('wallets_modal_responsive_root'));

    const getModalState = <T extends keyof TModalState>(key: T): TModalState[T] => {
        return modalState.get(key) as TModalState[T];
    };

    const setModalState = <T extends keyof TModalState>(key: T, value: TModalState[T]) => {
        updateModalState(new Map(modalState.set(key, value)));
    };

    const show = (ModalContent: React.ReactNode) => {
        setContent(ModalContent);
    };

    useEffect(() => {
        if (!rootResponsiveRef.current) {
            rootResponsiveRef.current = document.getElementById('wallets_modal_responsive_root');
        }
    }, []);

    const hide = () => {
        setContent(null);
    };

    useOnClickOutside(modalRef, isDesktop ? hide : () => undefined);

    return (
        <ModalContext.Provider
            value={{ hide, isOpen: content !== null, modalState, getModalState, setModalState, show }}
        >
            {children}
            {isDesktop &&
                rootRef.current &&
                content &&
                createPortal(<div ref={modalRef}>{content}</div>, rootRef.current)}
            {isMobile &&
                rootResponsiveRef.current &&
                content &&
                createPortal(<div ref={modalRef}>{content}</div>, rootResponsiveRef.current)}
        </ModalContext.Provider>
    );
};

export default ModalProvider;
