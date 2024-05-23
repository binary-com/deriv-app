import React from 'react';
import { DataList, Icon, Loading, MobileWrapper, Modal, Table, Text } from '@deriv/components';
import { isDesktop, isMobile, routes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import TransactionsCryptoCancelModal from './transactions-crypto-cancel-modal';
import TransactionsCryptoStatusModal from './transactions-crypto-status-modal';
import TransactionsCryptoRenderer from './transactions-crypto-renderer';
import { useCashierStore } from '../../stores/useCashierStores';
import { useCryptoTransactions } from '@deriv/hooks';

const getHeaders = () => [
    { text: localize('Transaction') },
    { text: localize('Amount') },
    { text: localize('Address') },
    { text: localize('Transaction hash') },
    { text: localize('Confirmations') },
    { text: localize('Time') },
    { text: localize('Status') },
    { text: localize('Action') },
];

const TransactionsCryptoHistory = observer(() => {
    const { client } = useStore();
    const { transaction_history, general_store } = useCashierStore();
    const { setIsTransactionsCryptoVisible } = transaction_history;
    const { data, isLoading } = useCryptoTransactions();
    const { setIsDeposit } = general_store;
    const { currency } = client;
    const [is_modal_visible, setIsModalVisible] = React.useState(false);

    React.useEffect(() => {
        return () => setIsTransactionsCryptoVisible(false);
    }, [setIsTransactionsCryptoVisible, currency]);

    const onClickBack = () => {
        setIsTransactionsCryptoVisible(false);
        if (window.location.pathname.endsWith(routes.cashier_deposit)) {
            setIsDeposit(true);
        }
    };

    return (
        <React.Fragment>
            <div className='transactions-crypto-history'>
                <div className='transactions-crypto-history__header'>
                    <div
                        className='transactions-crypto-history__back'
                        onClick={onClickBack}
                        data-testid='dt_transactions_crypto_history_back'
                    >
                        <Icon icon={isMobile() ? 'IcChevronLeftBold' : 'IcArrowLeftBold'} />
                        <Text as='p' size='xs' weight='bold'>
                            <Localize i18n_default_text={'{{currency}} recent transactions'} values={{ currency }} />
                        </Text>
                    </div>
                </div>
                <MobileWrapper>
                    <TransactionsCryptoCancelModal />
                    <TransactionsCryptoStatusModal />
                </MobileWrapper>
                {(data?.length || 0) > 0 ? (
                    <Table className='transactions-crypto-history__table'>
                        {isDesktop() && (
                            <Table.Header className='transactions-crypto-history__table-header'>
                                <Table.Row className='transactions-crypto-history__table-row'>
                                    {getHeaders().map(header => (
                                        <Table.Head key={header.text}>{header.text}</Table.Head>
                                    ))}
                                </Table.Row>
                            </Table.Header>
                        )}
                        <Table.Body className='transactions-crypto-history__table-body'>
                            {isLoading ? (
                                <Loading is_fullscreen={false} />
                            ) : (
                                <DataList
                                    // TODO: CHECK THIS TYPE ERROR
                                    data_source={data}
                                    rowRenderer={row_props => (
                                        <TransactionsCryptoRenderer
                                            {...row_props}
                                            onTooltipClick={() => setIsModalVisible(true)}
                                        />
                                    )}
                                    keyMapper={row => row.id}
                                    row_gap={isMobile() ? 8 : 0}
                                />
                            )}
                        </Table.Body>
                    </Table>
                ) : (
                    <div className='transactions-crypto-history__empty-text'>
                        <Text as='p' size='xs' color='disabled' align='center'>
                            <Localize i18n_default_text='No current transactions available' />
                        </Text>
                    </div>
                )}
            </div>
            <Modal
                has_close_icon
                is_open={is_modal_visible}
                title='Note'
                toggleModal={() => setIsModalVisible(old => !old)}
                width='44rem'
                height='14rem'
                className='transactions-crypto-history__modal'
            >
                <Modal.Body className='transactions-crypto-history__modal-body'>
                    {localize('The details of this transaction is available on CoinsPaid.')}
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
});

export default TransactionsCryptoHistory;
