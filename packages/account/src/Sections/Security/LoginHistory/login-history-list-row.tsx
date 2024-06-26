import clsx from 'clsx';
import { TLoginHistoryItems } from '../../../Types';
import { Table } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import getLoginHistoryTableHeaders from '../../../Constants/get-login-history-table-headers';
import ListCell from './list-cell';

const LoginHistoryListRow = ({ id, date, action, browser, ip, status }: TLoginHistoryItems) => {
    const { date_title, browser_title, action_title, ip_title, status_title } = getLoginHistoryTableHeaders();
    const { isDesktop } = useDevice();

    return (
        <div className={clsx('login-history__list__wrapper')} key={id}>
            <Table.Row className='login-history__list__row login-history__list__row--with-margin'>
                <Table.Cell className='login-history__list__row__cell'>
                    <ListCell title={date_title} text={date} />
                </Table.Cell>
            </Table.Row>
            <Table.Row className='login-history__list__row login-history__list__row--with-margin'>
                <Table.Cell className='login-history__list__row__cell'>
                    <ListCell
                        className='login-history__list__row__cell--browser'
                        title={browser_title}
                        text={browser === 'Unknown' ? <Localize i18n_default_text='Unknown' /> : browser}
                    />
                </Table.Cell>
                <Table.Cell className='login-history__list__row__cell'>
                    <ListCell
                        className='login-history__list__row__cell--action'
                        title={action_title}
                        text={<Localize i18n_default_text='{{action}}' values={{ action }} />}
                    />
                </Table.Cell>
            </Table.Row>
            <Table.Row className='login-history__list__row'>
                <Table.Cell className='login-history__list__row__cell'>
                    <ListCell className='login-history__list__row__cell--ip-value' title={ip_title} text={ip} />
                </Table.Cell>
                {isDesktop && (
                    <Table.Cell className='login-history__list__row__cell'>
                        <ListCell
                            title={status_title}
                            text={<Localize i18n_default_text='{{status}}' values={{ status }} />}
                        />
                    </Table.Cell>
                )}
            </Table.Row>
        </div>
    );
};

export default LoginHistoryListRow;
