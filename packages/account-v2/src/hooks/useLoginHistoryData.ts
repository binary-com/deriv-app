import UaParser from 'ua-parser-js';
import dayjs from 'dayjs';
import useAuthorize from '@deriv/api-v2/src/hooks/useAuthorize';
import useQuery from '@deriv/api-v2/src/useQuery';

type TData = {
    action: string;
    browser: string;
    date: string;
    id: number;
    ip: string;
    status: string;
}[];

export const useLoginHistoryData = (limit_value: number) => {
    const { isSuccess } = useAuthorize();

    const {
        data: LoginHistoryData,
        isLoading,
        ...LoginHistoryDataRest
    } = useQuery('login_history', {
        options: { enabled: isSuccess },
        payload: { limit: limit_value },
    });

    if (!isLoading) {
        const FetchLimit = LoginHistoryData?.login_history.length;
        const datas: TData = [];
        fetch(FetchLimit, datas, LoginHistoryData);
    }

    return {
        isLoading,
        data: LoginHistoryData,
        ...LoginHistoryDataRest,
    };
};

function fetch(FetchLimit, datas, LoginHistoryData) {
    for (let i = 0; i < FetchLimit; i++) {
        datas[i] = {
            action: '',
            browser: '',
            date: '',
            id: 0,
            ip: '',
            status: '',
        };

        const environment = LoginHistoryData?.login_history[i].environment;
        const environemntSplit = environment.split(' ');
        const MobileAppUa = environment.match(
            /(?<date>[0-9]+[a-zA-Z]+[0-9]\s[0-9:]+GMT)[\s](IP=)(?<ip>[\w:.]+)\sIP_COUNTRY=(?<country>([a-zA-Z]{2}))\s(User_AGENT=)(\w.*)(?<name>iPhone|Android)([\W\w]+)\s(?<app>Deriv P2P|Deriv GO)(?<version>[\w\W]+)\s(LANG=)([\w]{2})/
        );
        const dates = environemntSplit[0];
        const time = environemntSplit[1].replace('GMT', ' GMT');
        const parser = new UaParser();
        const parsed = parser.getBrowser();

        datas[i].date = `${dayjs(dates, 'DD-MMM-YY').format('YYYY-MM-DD')} and ${time}`;

        datas[i].action = LoginHistoryData?.login_history[i].action === 'login' ? 'Login' : 'Logout';

        datas[i].browser = `${parsed.name} ${parsed.version}`;

        datas[i].ip = environemntSplit[2].split('=')[1];

        datas[i].status = LoginHistoryData?.login_history[i].status === 1 ? 'Successful' : 'Failed';

        datas[i].id = i;
    }
}
