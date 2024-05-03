import { TAccountClosureReasonsFormValues } from '../utils';

export const accountClosureReasons = (): {
    label: string;
    ref: string;
    value: string;
}[] => [
    {
        label: 'I have other financial priorities.',
        ref: 'financialPriorities',
        value: 'financial-priorities',
    },
    {
        label: 'I want to stop myself from trading.',
        ref: 'stopTrading',
        value: 'stop-trading',
    },
    {
        label: "I'm no longer interested in trading.",
        ref: 'notInterested',
        value: 'not-interested',
    },
    {
        label: 'I prefer another trading website.',
        ref: 'anotherWebsite',
        value: 'another-website',
    },
    {
        label: "The platforms aren't user friendly.",
        ref: 'notUserFriendly',
        value: 'not-user-friendly',
    },
    {
        label: 'Making deposits and withdrawals is difficult.',
        ref: 'difficultTransactions',
        value: 'difficult-transactions',
    },
    {
        label: 'The platforms lack key features or functionality.',
        ref: 'lackOfFeatures',
        value: 'lack-of-features',
    },
    {
        label: 'Customer service was unsatisfactory.',
        ref: 'unsatisfactoryService',
        value: 'unsatisfactory-service',
    },
    {
        label: "I'm closing my account for other reasons.",
        ref: 'otherReasons',
        value: 'other-reasons',
    },
];

export const MAX_ALLOWED_REASONS_FOR_CLOSING_ACCOUNT = 3;
export const CHARACTER_LIMIT_FOR_CLOSING_ACCOUNT = 110;

export type TAccountClosureFormActions =
    | { payload: boolean; type: 'displayConfirmModal' }
    | { payload: boolean; type: 'displaySuccessModal' }
    | { payload: boolean; type: 'displayWarningModal' }
    | { payload: TAccountClosureReasonsFormValues; type: 'disableCheckbox' }
    | { payload: TAccountClosureReasonsFormValues; type: 'remainingCharacters' };
