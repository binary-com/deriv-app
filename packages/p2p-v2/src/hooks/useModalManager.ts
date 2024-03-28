import { useEffect } from 'react';
import { useMap } from 'usehooks-ts';
import useQueryString from './useQueryString';
import useDevice from './useDevice';

type TUseModalManagerConfig = {
    shouldReinitializeModals?: boolean;
};

type TShowModalOptions = {
    shouldStackModals?: boolean;
};

/**
 * Hook to manage states for showing/hiding multiple modals
 * Use this hook when you are managing more than 1 modal to show/hide
 *
 * @example
 * ```
 * const {isModalOpenFor, showModal} = useModalManager()
 *
 * return (
 *      <>
 *          <ModalA isOpen={isModalOpenFor('ModalA')} />
 *          <ModalB isOpen={isModalOpenFor('ModalB')} />
 *          <button onClick={() => showModal('ModalA')}>...</button>
 *      </>
 * )
 * ```
 */
export default function useModalManager(config?: TUseModalManagerConfig) {
    const { deleteQueryString, queryString, setQueryString } = useQueryString();
    const { isMobile } = useDevice();

    const [isModalOpenScopes, actions] = useMap();

    useEffect(() => {
        if (config?.shouldReinitializeModals !== undefined && config.shouldReinitializeModals === false) {
            deleteQueryString('modal');
        } else {
            // sync modal query string in the URL with the initial modal open scopes
            const modalHash = queryString.get('modal');
            if (modalHash) {
                const modalKeys = modalHash.split('+');
                const currentModal = modalKeys.slice(-1)[0];
                modalKeys.forEach(modalKey => {
                    actions.set(modalKey, isMobile);
                });
                actions.set(currentModal, true);
            }
        }
    }, []);

    const hideModal = () => {
        const modalHash = queryString.get('modal');

        if (modalHash) {
            const modalIds = modalHash.split('+');
            const currentModalId = modalIds.pop();
            const previousModalId = modalIds.slice(-1)[0];
            if (previousModalId) {
                actions.set(currentModalId, false);
                actions.set(previousModalId, true);
            } else {
                actions.set(currentModalId, false);
            }
            if (modalIds.length === 0) {
                deleteQueryString('modal');
            } else {
                setQueryString({
                    modal: modalIds.join('+'),
                });
            }
        }
    };

    /**
     * Keep the previous modal ids in the URL query strings separated by '+'
     * This way, when there is a new modal to be shown, we can track the previous modals from the query string based on the last 2 segments
     *
     * Example:
     * - ModalA is shown, URL becomes /...?modal=ModalA (current modal is ModalA, there is no previous modal)
     * - ModalB is shown next, URL becomes /...?modal=ModalA+ModalB (current modal is ModalB, previous modal is ModalA)
     * - ModalC is shown next, URL becomes /...?modal=ModalA+ModalB+ModalC (current modal is ModalC, previous modal is ModalB)
     * - ModalC is closed, URL becomes becomes /...?modal=modalA+ModalB (current modal is ModalB, previous modal is ModalA)
     */
    const showModal = (modalId: string, options?: TShowModalOptions) => {
        const modalHash = queryString.get('modal');

        if (modalHash) {
            const modalIds = modalHash.split('+');
            const currentModalId = modalIds.slice(-1)[0];
            // set the previous modal open state to false if shouldStackModals is false, otherwise set it to true (default true for mobile)
            // set the new modal open state to true
            actions.set(currentModalId, options?.shouldStackModals || isMobile);
            actions.set(modalId, true);
            // push the state of the new modal to the hash
            modalIds.push(modalId);
            setQueryString({
                modal: modalIds.join('+'),
            });
        } else {
            actions.set(modalId, true);
            setQueryString({
                modal: modalId,
            });
        }
    };

    const isModalOpenFor = (modalKey: string) => {
        return isModalOpenScopes.get(modalKey) || false;
    };

    return {
        hideModal,
        isModalOpenFor,
        showModal,
    };
}
