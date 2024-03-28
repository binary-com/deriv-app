/* eslint-disable sonarjs/no-duplicate-string */
export const getTradingAssessmentQuestions = () => [
    {
        answerOptions: [
            { text: 'Yes', value: 'Yes' },
            { text: 'No', value: 'No' },
        ],
        fieldType: 'radio',
        form_control: 'risk_tolerance',
        questionText: 'Do you understand that you could potentially lose 100% of the money you use to trade?',
        section: 'risk_tolerance',
    },
    {
        answer_options: [
            {
                text: 'I have an academic degree, professional certification, and/or work experience related to financial services.',
                value: 'I have an academic degree, professional certification, and/or work experience.',
            },
            {
                text: 'I trade forex CFDs and other complex financial instruments regularly on other platforms.',
                value: 'I trade forex CFDs and other complex financial instruments.',
            },
            {
                text: 'I have attended seminars, training, and/or workshops related to trading.',
                value: 'I have attended seminars, training, and/or workshops.',
            },
            {
                text: 'I am interested in trading but have very little experience.',
                value: 'I have little experience.',
            },
            {
                text: 'I have no knowledge and experience in trading at all.',
                value: 'I have no knowledge.',
            },
        ],
        field_type: 'radio',
        form_control: 'source_of_experience',
        question_text: 'How much knowledge and experience do you have in relation to online trading?',
        section: 'source_of_experience',
    },
    {
        questions: [
            {
                answer_options: [
                    {
                        text: 'No experience',
                        value: 'No experience',
                    },
                    {
                        text: 'Less than a year',
                        value: 'Less than a year',
                    },
                    {
                        text: '1 - 2 years',
                        value: '1 - 2 years',
                    },
                    {
                        text: 'Over 3 years',
                        value: 'Over 3 years',
                    },
                ],
                field_type: 'dropdown',
                form_control: 'cfd_experience',
                question_text: 'How much experience do you have in CFD trading?',
            },
            {
                answer_options: [
                    {
                        text: 'None',
                        value: 'No transactions in the past 12 months',
                    },
                    {
                        text: '1 - 5',
                        value: '1 - 5 transactions in the past 12 months',
                    },
                    {
                        text: '6 - 10',
                        value: '6 - 10 transactions in the past 12 months',
                    },
                    {
                        text: '11 - 39',
                        value: '11 - 39 transactions in the past 12 months',
                    },
                    {
                        text: '40 or more',
                        value: '40 transactions or more in the past 12 months',
                    },
                ],
                field_type: 'dropdown',
                form_control: 'cfd_frequency',
                question_text: 'How many CFD trades have you placed in the past 12 months?',
            },
            {
                answer_options: [
                    {
                        text: 'No experience',
                        value: 'No experience',
                    },
                    {
                        text: 'Less than a year',
                        value: 'Less than a year',
                    },
                    {
                        text: '1 - 2 years',
                        value: '1 - 2 years',
                    },
                    {
                        text: 'Over 3 years',
                        value: 'Over 3 years',
                    },
                ],
                field_type: 'dropdown',
                form_control: 'trading_experience_financial_instruments',
                question_text: 'How much experience do you have with other financial instruments?',
            },
            {
                answer_options: [
                    {
                        text: 'None',
                        value: 'No transactions in the past 12 months',
                    },
                    {
                        text: '1 - 5',
                        value: '1 - 5 transactions in the past 12 months',
                    },
                    {
                        text: '6 - 10',
                        value: '6 - 10 transactions in the past 12 months',
                    },
                    {
                        text: '11 - 39',
                        value: '11 - 39 transactions in the past 12 months',
                    },
                    {
                        text: '40 or more',
                        value: '40 transactions or more in the past 12 months',
                    },
                ],
                field_type: 'dropdown',
                form_control: 'trading_frequency_financial_instruments',
                question_text:
                    'How many trades have you placed with other financial instruments in the past 12 months?',
            },
        ],
        section: 'trading_experience',
    },
    {
        answer_options: [
            {
                text: 'Purchase commodities or shares of a company.',
                value: 'Purchase shares of a company or physical commodities.',
            },
            {
                text: 'Place a position on the price movement of an asset where the outcome is a fixed return or nothing at all.',
                value: 'Place a bet on the price movement.',
            },
            {
                text: 'Speculate on the price movement of an asset without actually owning it.',
                value: 'Speculate on the price movement.',
            },
            {
                text: 'Make a long-term investment for a guaranteed profit.',
                value: 'Make a long-term investment.',
            },
        ],
        field_type: 'radio',
        form_control: 'cfd_trading_definition',
        question_text: 'In your understanding, CFD trading allows you to',
        section: 'trading_knowledge',
    },
    {
        answer_options: [
            {
                text: 'Leverage helps to mitigate risk.',
                value: 'Leverage is a risk mitigation technique.',
            },
            {
                text: 'Leverage prevents you from opening large positions.',
                value: 'Leverage prevents you from opening large positions.',
            },
            { text: 'Leverage guarantees profits.', value: 'Leverage guarantees profits.' },
            {
                text: 'Leverage lets you open large positions for a fraction of trade value, which may result in increased profit or loss.',
                value: "Leverage lets you open larger positions for a fraction of the trade's value.",
            },
        ],
        field_type: 'radio',
        form_control: 'leverage_impact_trading',
        question_text: 'How does leverage affect CFD trading?',
        section: 'trading_knowledge',
    },
    {
        answer_options: [
            {
                text: 'Cancel your trade at any time within a specified timeframe.',
                value: 'Cancel your trade at any time within a chosen timeframe.',
            },
            {
                text: 'Close your trade automatically when the loss is equal to or more than a specified amount, as long as there is adequate market liquidity.',
                value: 'Close your trade automatically when the loss is more than or equal to a specific amount.',
            },
            {
                text: 'Close your trade automatically when the profit is equal to or more than a specified amount, as long as there is adequate market liquidity.',
                value: 'Close your trade automatically when the profit is more than or equal to a specific amount.',
            },
            {
                text: 'Make a guaranteed profit on your trade.',
                value: 'Make a guaranteed profit on your trade.',
            },
        ],
        field_type: 'radio',
        form_control: 'leverage_trading_high_risk_stop_loss',
        question_text:
            "Leverage trading is high-risk, so it's a good idea to use risk management features such as stop loss. Stop loss allows you to",
        section: 'trading_knowledge',
    },
    {
        answer_options: [
            {
                text: 'When opening a leveraged CFD trade.',
                value: 'When opening a Leveraged CFD trade.',
            },
            { text: 'When trading multipliers.', value: 'When trading Multipliers.' },
            {
                text: 'When buying shares of a company.',
                value: 'When buying shares of a company.',
            },
            { text: 'All of the above.', value: 'All of the above.' },
        ],
        field_type: 'radio',
        form_control: 'required_initial_margin',
        question_text: 'When are you required to pay an initial margin?',
        section: 'trading_knowledge',
    },
];
