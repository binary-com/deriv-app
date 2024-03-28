export type TModalContent = {
    account_type_card: string;
    selectAccountTypeCard: React.Dispatch<React.SetStateAction<string>>;
    is_financial_available: boolean;
    is_synthetic_available: boolean;
    is_swapfree_available: boolean;
};

export type TAccountType = {
    title_and_type: string;
    description: string;
    icon: string;
};

export type TAccountCard = {
    account_type_card: string;
    title_and_type: string;
    description: string;
    icon: string;
    selectAccountTypeCard: React.Dispatch<React.SetStateAction<string>>;
};

export type TTradingPlatformAvailableAccount = {
    market_type: 'financial' | 'gaming' | 'all';
    name: string;
    requirements: {
        after_first_deposit: {
            financial_assessment: string[];
        };
        compliance: {
            mt5: string[];
            tax_information: string[];
        };
        signup: string[];
    };
    shortcode: 'bvi' | 'labuan' | 'svg' | 'vanuatu';
    sub_account_type: string;
    max_count?: number;
    available_count?: number;
};
