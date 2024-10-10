import { FormatUtils } from '@deriv-com/utils';
import { THooks } from '../../../../../../../types';

export type TVerifyPersonalDetailsValues = {
    arePersonalDetailsVerified?: boolean;
    dateOfBirth?: ReturnType<typeof FormatUtils.getFormattedDateString>;
    firstName: THooks.AccountSettings['first_name'];
    lastName: THooks.AccountSettings['last_name'];
};
