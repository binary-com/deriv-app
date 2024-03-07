import { useCallback, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

type ModalId = 'GetADerivAccountDialog' | 'JurisdictionModal' | 'MT5PasswordModal';

/**
 * @description A hook to manage query params for modals
 * @returns isOpen: (modalId: ModalId) => boolean
 * @returns openModal: (modalId: string) => void
 * @returns closeModal: () => void
 * @returns queryParams: URLSearchParams
 * @example
 * const { isOpen, openModal, closeModal, queryParams } = useQueryParams();
 * const isModalOpen = isOpen('GetADerivAccountDialog');
 * openModal('GetADerivAccountDialog');
 * closeModal();
 */
const useQueryParams = () => {
    const { search } = useLocation();
    const history = useHistory();

    const queryParams = useMemo(() => new URLSearchParams(search), [search]);

    const isOpen = useCallback((modalId: ModalId) => queryParams.get('modal') === modalId, [queryParams]);

    const openModal = useCallback(
        (modalId: string) => {
            queryParams.set('modal', modalId);
            history.push({
                pathname: history.location.pathname,
                search: queryParams.toString(),
                state: { modal: modalId },
            });
        },
        [queryParams, history]
    );

    const closeModal = useCallback(() => {
        queryParams.delete('modal');
        history.push({
            pathname: history.location.pathname,
            search: queryParams.toString(),
        });
    }, [queryParams, history]);

    useEffect(() => {
        closeModal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        isOpen,
        openModal,
        closeModal,
        queryParams,
    };
};

export default useQueryParams;
