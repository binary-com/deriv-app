import dayjs from 'dayjs';
import UAParser from 'ua-parser-js';
import { LoginHistory } from '@deriv/api-types';

export const formattedLoginHistoryUtils = (loginHistory: LoginHistory) =>
    loginHistory.map(data => {
        const environment = data.environment;
        const environmentSplit = environment.split(' ');
        const mobileAppUA = environment.match(
            /(?<date>[0-9a-zA-Z-]+\s[0-9:]+GMT)[\s](IP=)(?<ip>[\w:.]+)\sIP_COUNTRY=(?<country>([a-zA-Z]{2}))\s(User_AGENT=)(\w.*)(?<name>iPhone|Android)([\W\w]+)\s(?<app>Deriv P2P|Deriv GO)(?<version>[\w\W]+)\s(LANG=)([\w]{2})/
        );
        const userAgentString = environment.substring(environment.indexOf('User_AGENT'), environment.indexOf('LANG'));

        const dates = environmentSplit[0];
        const time = environmentSplit[1].replace('GMT', '  GMT');

        const parser = new UAParser(userAgentString);
        const parserAgent = parser.getBrowser();

        const userAgent = mobileAppUA ? mobileAppUA.groups : parserAgent;
        return {
            action: data.action === 'login' ? 'Login' : 'Logout',
            browser: `${userAgent?.name} ${userAgent?.version}`,
            date: `${dayjs(dates, 'DD-MMM-YY').format('YYYY-MM-DD')}  ${time}`,
            ip: environmentSplit[2].split('=')[1],
            status: data.status === 1 ? 'Successful' : 'Failed',
        };
    });
