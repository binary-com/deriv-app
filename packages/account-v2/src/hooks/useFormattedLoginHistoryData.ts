import dayjs from 'dayjs';
import UAParser from 'ua-parser-js';

type TData = {
    action: string;
    browser: string;
    date: string;
    id: number;
    ip: string;
    status: string;
}[];

export const useFormattedLoginHistoryData = loginhistorydata => {
    const fetchLimit = Math.min(50, loginhistorydata.length);

    const data: TData = [];
    for (let i = 0; i < fetchLimit; i++) {
        data[i] = {
            action: '',
            browser: '',
            date: '',
            id: 0,
            ip: '',
            status: '',
        };

        const environment = loginhistorydata[i].environment;
        const environemntSplit = environment.split(' ');
        const MobileAppUa = environment.match(
            /(?<date>[0-9]+[a-zA-Z]+[0-9]\s[0-9:]+GMT)[\s](IP=)(?<ip>[\w:.]+)\sIP_COUNTRY=(?<country>([a-zA-Z]{2}))\s(User_AGENT=)(\w.*)(?<name>iPhone|Android)([\W\w]+)\s(?<app>Deriv P2P|Deriv GO)(?<version>[\w\W]+)\s(LANG=)([\w]{2})/
        );
        const dates = environemntSplit[0];
        const time = environemntSplit[1].replace('GMT', ' GMT');
        const parser = new UAParser();
        const userAgent = parser.getBrowser();

        data[i].date = `${dayjs(dates, 'DD-MMM-YY').format('YYYY-MM-DD')} and ${time}`;

        data[i].action = loginhistorydata[i].action === 'login' ? 'Login' : 'Logout';

        data[i].browser = `${userAgent.name} ${userAgent.version}`;

        data[i].ip = environemntSplit[2].split('=')[1];

        data[i].status = loginhistorydata[i].status === 1 ? 'Successful' : 'Failed';

        data[i].id = i;
    }

    return data;
};
