import * as Yup from 'yup';
import { TDTraderAccountDetails } from 'src/types';
import { accountClosureReasons } from '../constants';

export const getAccountClosureValidationSchema = () => {
    return Yup.object({
        anotherWebsite: Yup.boolean(),
        difficultTransactions: Yup.boolean(),
        doToImprove: Yup.string(),
        financialPriorities: Yup.boolean(),
        lackOfFeatures: Yup.boolean(),
        notInterested: Yup.boolean(),
        notUserFriendly: Yup.boolean(),
        otherReasons: Yup.boolean(),
        otherTradingPlatforms: Yup.string(),
        stopTrading: Yup.boolean(),
        unsatisfactoryService: Yup.boolean(),
    }).default(() => ({
        anotherWebsite: false,
        difficultTransactions: false,
        doToImprove: '',
        financialPriorities: false,
        lackOfFeatures: false,
        notInterested: false,
        notUserFriendly: false,
        otherReasons: false,
        otherTradingPlatforms: '',
        stopTrading: false,
        unsatisfactoryService: false,
    }));
};

export const validateAccountClosure = (values: TAccountClosureReasonsFormValues, isDirty: boolean) => {
    if (isDirty) {
        const {
            anotherWebsite,
            difficultTransactions,
            financialPriorities,
            lackOfFeatures,
            notInterested,
            notUserFriendly,
            otherReasons,
            stopTrading,
            unsatisfactoryService,
        } = values;

        return (
            anotherWebsite ||
            difficultTransactions ||
            financialPriorities ||
            lackOfFeatures ||
            notInterested ||
            notUserFriendly ||
            otherReasons ||
            stopTrading ||
            unsatisfactoryService
        );
    }
    return true;
};

export type TAccountClosureReasonsFormValues = Yup.InferType<ReturnType<typeof getAccountClosureValidationSchema>>;

export const getAccountClosureReasons = (values: TAccountClosureReasonsFormValues) => {
    const processedInput = Object.entries(values).filter(
        ([, value]) =>
            (typeof value === 'boolean' && value === true) || (typeof value === 'string' && value.trim().length > 0)
    );

    return processedInput
        .map(([key, value]) => {
            if (typeof value === 'boolean' && value === true) {
                return accountClosureReasons().find(reason => reason.ref === key)?.value;
            } else if (typeof value === 'string' && value.trim().length > 0) {
                return value.trim();
            }
        })
        .join(',')
        .replace(/(\r\n|\n|\r)/gm, ' ');
};

export const getDTraderPendingAccountDetails = (accountDetails: TDTraderAccountDetails) => {
    if (!accountDetails?.length) {
        return [];
    }
    return accountDetails
        .filter(account => account.broker !== 'VRTC')
        .map(account => ({
            balance: account.display_balance,
            currency: account.currency,
            loginId: account.loginid,
        }));
};
