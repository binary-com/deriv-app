import { Table } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import getLoginHistoryTableHeaders from '../../../Constants/get-login-history-table-headers';
import LoginHistoryTableRow from './login-history-table-row';
import LoginHistoryListRow from './login-history-list-row';

type TLoginHistoryData = {
    id: number;
    date: string;
    action: string;
    browser: string;
    ip: string;
    status: string;
}[];

type TGetFields = {
    [key: string]: JSX.Element;
};

type TLoginHistoryContent = {
    data: TLoginHistoryData;
};

const LoginHistoryContent = ({ data }: TLoginHistoryContent) => {
    const { isDesktop } = useDevice();

    return isDesktop ? renderTable(getLoginHistoryTableHeaders(), data) : renderList(data);
};

const renderTable = (fields: TGetFields, login_history: TLoginHistoryData) => (
    <Table fixed className='login-history__table'>
        <Table.Header>
            <Table.Row className='login-history__table__header'>
                {/* Getting values of key as string, field as JSX.Element from getLoginHistoryTableHeaders */}
                {Object.entries(fields).map(([key, field]) => (
                    <Table.Head key={key}>{field}</Table.Head>
                ))}
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {login_history.map(item => (
                <LoginHistoryTableRow key={item.id} {...item} />
            ))}
        </Table.Body>
    </Table>
);

const renderList = (login_history: TLoginHistoryData) => (
    <Table className='login-history__list'>
        <Table.Body>
            {login_history.map(item => (
                <LoginHistoryListRow key={item.id} {...item} />
            ))}
        </Table.Body>
    </Table>
);

export default LoginHistoryContent;
