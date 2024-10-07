import { action, observable, makeObservable } from 'mobx';
import type { TWebSocket, TRootStore } from '../types';

export default class TransactionHistoryStore {
    constructor(
        public WS: TWebSocket,
        public root_store: TRootStore
    ) {
        makeObservable(this, {
            is_transactions_crypto_cancel_modal_visible: observable,
            is_transactions_crypto_status_modal_visible: observable,
            is_transactions_crypto_visible: observable,
            selected_crypto_transaction_id: observable,
            selected_crypto_status: observable,
            selected_crypto_status_description: observable,
            cancelCryptoTransaction: action.bound,
            setSelectedCryptoTransactionId: action.bound,
            setIsTransactionsCryptoCancelModalVisible: action.bound,
            showTransactionsCryptoCancelModal: action.bound,
            hideTransactionsCryptoCancelModal: action.bound,
            setSelectedCryptoStatus: action.bound,
            setSelectedCryptoStatusDescription: action.bound,
            setIsTransactionsCryptoStatusModalVisible: action.bound,
            showTransactionsCryptoStatusModal: action.bound,
            hideTransactionsCryptoStatusModal: action.bound,
            setIsTransactionsCryptoVisible: action.bound,
        });
    }
    is_transactions_crypto_cancel_modal_visible = false;
    is_transactions_crypto_status_modal_visible = false;
    is_transactions_crypto_visible = false;
    selected_crypto_transaction_id = '';
    selected_crypto_status = '';
    selected_crypto_status_description: JSX.Element | string = '';

    async cancelCryptoTransaction(transaction_id: string) {
        await this.WS.cancelCryptoTransaction?.(transaction_id).then(response => {
            if (!response.error) {
                this.setSelectedCryptoTransactionId('');
                this.setIsTransactionsCryptoCancelModalVisible(false);
                return Promise.resolve(response);
            }
            return Promise.reject(response.error);
        });
    }

    setSelectedCryptoTransactionId(id: string): void {
        this.selected_crypto_transaction_id = id;
    }

    setIsTransactionsCryptoCancelModalVisible(is_visible: boolean): void {
        this.is_transactions_crypto_cancel_modal_visible = is_visible;
    }

    showTransactionsCryptoCancelModal(id: string): void {
        this.setSelectedCryptoTransactionId(id);
        this.setIsTransactionsCryptoCancelModalVisible(true);
    }

    hideTransactionsCryptoCancelModal(): void {
        this.setSelectedCryptoTransactionId('');
        this.setIsTransactionsCryptoCancelModalVisible(false);
    }

    setSelectedCryptoStatus(status: string): void {
        this.selected_crypto_status = status;
    }

    setSelectedCryptoStatusDescription(description: JSX.Element | string): void {
        this.selected_crypto_status_description = description;
    }

    setIsTransactionsCryptoStatusModalVisible(is_visible: boolean): void {
        this.is_transactions_crypto_status_modal_visible = is_visible;
    }

    showTransactionsCryptoStatusModal(description: JSX.Element | string, name: string): void {
        this.setSelectedCryptoStatusDescription(description);
        this.setSelectedCryptoStatus(name);
        this.setIsTransactionsCryptoStatusModalVisible(true);
    }

    hideTransactionsCryptoStatusModal() {
        this.setIsTransactionsCryptoStatusModalVisible(false);
    }

    setIsTransactionsCryptoVisible(is_visible: boolean): void {
        this.is_transactions_crypto_visible = is_visible;
    }
}
