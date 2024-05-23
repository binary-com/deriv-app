import React from 'react';
import { localize, Localize } from '@deriv/translations';
import { getLegalEntityName } from '@deriv/shared';
import 'Sass/app/modules/complaints-policy.scss';
import { observer, useStore } from '@deriv/stores';

const getIntroductionText = (landing_company_shortcode, mt5_login_list) => {
    // * mt5_login_list returns these:
    // landing_company_short: "svg" | "maltainvest" |  "vanuatu"  | "labuan" | "bvi"
    const has_vanuatu = mt5_login_list.some(item => item.landing_company_short === 'vanuatu');
    const has_labuan = mt5_login_list.some(item => item.landing_company_short === 'labuan');

    switch (landing_company_shortcode) {
        case 'maltainvest':
            return localize(
                'This policy, which may change from time to time, applies to your account registered with {{legal_entity_name}}.',
                {
                    legal_entity_name: getLegalEntityName('maltainvest'),
                }
            );
        default:
            if (has_vanuatu && has_labuan) {
                return localize(
                    'This complaints policy, which may change from time to time, applies to your account(s) registered with {{legal_entity_name_svg}}, {{legal_entity_name_fx}}, and {{legal_entity_name_v}}.',
                    {
                        legal_entity_name_svg: getLegalEntityName('svg'),
                        legal_entity_name_fx: getLegalEntityName('fx'),
                        legal_entity_name_v: getLegalEntityName('v'),
                    }
                );
            } else if (has_vanuatu) {
                return localize(
                    'This complaints policy, which may change from time to time, applies to your account(s) registered with {{legal_entity_name_svg}} and {{legal_entity_name_v}}.',
                    {
                        legal_entity_name_svg: getLegalEntityName('svg'),
                        legal_entity_name_v: getLegalEntityName('v'),
                    }
                );
            } else if (has_labuan) {
                return localize(
                    'This complaints policy, which may change from time to time, applies to your account(s) registered with {{legal_entity_name_svg}} and {{legal_entity_name_fx}}.',
                    {
                        legal_entity_name_svg: getLegalEntityName('svg'),
                        legal_entity_name_fx: getLegalEntityName('fx'),
                    }
                );
            }
            return localize(
                'This complaints policy, which may change from time to time, applies to your account(s) registered with {{legal_entity_name_svg}}.',
                {
                    legal_entity_name_svg: getLegalEntityName('svg'),
                }
            );
    }
};

const getFairTreatmentText = landing_company_shortcode => {
    if (landing_company_shortcode === 'maltainvest') {
        return (
            <Localize
                i18n_default_text='We are committed to treating our clients fairly and providing them with excellent service.<0/><1/>We would love to hear from you on how we can improve our services to you. Any information you provide will be treated in the strictest confidence. Rest assured that you will be heard, valued, and always treated fairly.'
                components={[<br key={0} />, <br key={1} />]}
            />
        );
    }
    return (
        <Localize
            i18n_default_text='Our company is one of the oldest and most reputable online trading companies in the world. We are committed to treat our clients fairly and provide them with excellent service.<0/><1/>Please provide us with feedback on how we can improve our services to you. Rest assured that you will be heard, valued, and treated fairly at all times.'
            components={[<br key={0} />, <br key={1} />]}
        />
    );
};

const getGeneralQueriesText = landing_company_shortcode => {
    return (
        <Localize
            i18n_default_text='If you have an inquiry regarding your trading account with {{legal_entity_name}}, you can contact us through our <0>Help centre</0> or by chatting with a representative via <1>Live Chat</1>.<2/><3/>We are committed to resolving your query in the quickest time possible and appreciate your patience in allowing us time to resolve the matter.<4/><5/>We strive to provide the best possible service and support to our customers. However, in the event that we are unable to resolve your query or if you feel that our response is unsatisfactory, we want to hear from you. We welcome and encourage you to submit an official complaint to us so that we can review your concerns and work towards a resolution.'
            components={[
                <a
                    key={0}
                    className='link link--orange'
                    rel='noopener noreferrer'
                    target='_blank'
                    href='https://eu.deriv.com/help-centre/'
                />,
                <a
                    key={1}
                    className='link link--orange'
                    rel='noopener noreferrer'
                    target='_blank'
                    href='https://eu.deriv.com/livechat/'
                />,
                <br key={2} />,
                <br key={3} />,
                <br key={4} />,
                <br key={5} />,
            ]}
            values={{ legal_entity_name: getLegalEntityName(landing_company_shortcode) }}
        />
    );
};

const getYourDecisionText = landing_company_shortcode => {
    const texts = [];

    texts.push(
        <Localize
            key={0}
            i18n_default_text='If you are not satisfied with the outcome, you can escalate your complaint to the <0>Financial Commission</0>.'
            components={[
                <a
                    key={0}
                    className='link link--orange'
                    rel='noopener noreferrer'
                    target='_blank'
                    href='https://financialcommission.org/resolving-a-dispute/how-to-file-a-complaintdispute/'
                />,
            ]}
        />
    );

    if (landing_company_shortcode === 'maltainvest') {
        texts.push(
            <Localize
                key={texts.length}
                i18n_default_text='<0/><1/>You may also raise your unresolved dispute to the <2>Office of the Arbiter for Financial Services</2>.'
                components={[
                    <br key={0} />,
                    <br key={1} />,
                    <a
                        key={2}
                        className='link link--orange'
                        rel='noopener noreferrer'
                        target='_blank'
                        href='https://www.financialarbiter.org.mt/'
                    />,
                ]}
            />
        );
    }

    return texts;
};

const getSubmissionOfAComplaintText = () => (
    <Localize
        i18n_default_text='To file a complaint about our service, send an email to <0>complaints@deriv.com</0> and state your complaint in detail. Please submit any relevant screenshots of your trading or system for our better understanding.'
        components={[
            <a
                key={0}
                className='link link--orange'
                rel='noopener noreferrer'
                target='_blank'
                href='mailto:complaints@deriv.com'
            />,
        ]}
    />
);

const Content = observer(({ landing_company_shortcode }) => {
    const { client } = useStore();
    const { mt5_login_list } = client;
    const policy_content = [
        {
            id: 'introduction',
            title: localize('1. Introduction'),
            content: {
                text: getIntroductionText(landing_company_shortcode, mt5_login_list),
            },
        },
        {
            id: 'fair_treatment',
            title: localize('2. Fair treatment'),
            content: {
                text: getFairTreatmentText(landing_company_shortcode),
            },
        },
        {
            id: 'general_queries',
            title: localize('3. General queries'),
            content: {
                text: getGeneralQueriesText(landing_company_shortcode),
            },
        },
        {
            id: 'complaints_and_disputes',
            title: localize('3. Complaints and Disputes'),
            content: {
                text: localize('Our complaints process comprises the following 4 steps:'),
                sub_content: [
                    {
                        title: localize('3.1. Submission of a complaint'),
                        text: getSubmissionOfAComplaintText(),
                    },
                    {
                        title: localize('3.2. Handling your complaint'),
                        text: localize(
                            'We shall acknowledge receiving your complaint, review it carefully, and keep you updated on the handling process. We might request further information or clarifications to facilitate the resolution of the complaint.'
                        ),
                    },
                    {
                        title: localize('3.3. Resolving your complaint'),
                        text: localize(
                            'We shall try to resolve your complaint within 15 business days. We will inform you of the outcome together with an explanation of our position and propose any remedial measures we intend to take.'
                        ),
                    },
                    {
                        title: localize('3.4. Your decision'),
                        text: getYourDecisionText(landing_company_shortcode),
                    },
                ],
            },
        },
        {
            id: 'complaints',
            title: localize('4. Complaints'),
            content: {
                text: localize(
                    'We take all complaints seriously and aim to resolve them as quickly and fairly as possible. If you are unhappy with any aspect of our service, please let us know by submitting a complaint using the guidance below:'
                ),
                sub_content: [
                    {
                        title: localize('4.1. What is considered a complaint?'),
                        text: (
                            <Localize
                                i18n_default_text='A complaint is any expression of dissatisfaction by a client regarding our products or services that requires a formal response.<0/><1/>If what you submit does not fall within the scope of a complaint, we may reclassify it as a query and forward it to the relevant department for handling. However, if you believe that your query should be classified as a complaint due to its relevance to the investment services provided by {{legal_entity_name}}, you may request that we reclassify it accordingly.'
                                components={[<br key={0} />, <br key={1} />]}
                                values={{ legal_entity_name: getLegalEntityName(landing_company_shortcode) }}
                            />
                        ),
                    },
                    {
                        title: localize('4.2. Submission of a complaint'),
                        text: (
                            <Localize
                                i18n_default_text='To submit a complaint, please send an email to <0>complaints@deriv.com</0>, providing as much detail as possible. To help us investigate and resolve your complaint more efficiently, please include the following information:'
                                components={[
                                    <a
                                        key={0}
                                        className='link link--orange'
                                        rel='noopener noreferrer'
                                        target='_blank'
                                        href='mailto:complaints@deriv.com'
                                    />,
                                ]}
                            />
                        ),
                        bullets: [
                            <Localize
                                key={0}
                                i18n_default_text='<0>&bull;</0>Your account number'
                                components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                            />,
                            <Localize
                                key={1}
                                i18n_default_text='<0>&bull;</0>A clear and detailed description of your complaint, including any relevant dates, times, and transactions'
                                components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                            />,
                            <Localize
                                key={2}
                                i18n_default_text='<0>&bull;</0>Any relevant screenshots or supporting documentation that will assist us in understanding the issue'
                                components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                            />,
                        ],
                    },
                    {
                        title: localize('4.3. Acknowledging your complaint'),
                        text: localize(
                            'Once you submit your complaint, we will send you an acknowledgement email to confirm that we have received it.'
                        ),
                    },
                    {
                        title: localize('4.4. Handling your complaint'),
                        text: localize(
                            'Once we have received the details of your complaint, we shall review it carefully and keep you updated on the handling process. We might request further information or clarifications to facilitate the resolution of the complaint.'
                        ),
                    },
                    {
                        title: localize('4.5. Resolving your complaint'),
                        text: localize(
                            'We shall try to resolve your complaint within 15 business days. We will inform you of the outcome together with an explanation of our position and propose any remedial measures we intend to take.'
                        ),
                    },
                    {
                        title: localize('4.6. Your decision'),
                        text: (
                            <Localize
                                i18n_default_text='If we are unable to resolve your complaint or you are not satisfied with the outcome, you can escalate your complaint to the Office of the Arbiter for Financial Services.<0/><1/><2>Filing complaints with the Office of the Arbiter for Financial Services</2>'
                                components={[
                                    <br key={0} />,
                                    <br key={1} />,
                                    <span key={2} className='complaints-policy__list-item-underlined' />,
                                ]}
                            />
                        ),
                        bullets: [
                            <Localize
                                key={0}
                                i18n_default_text='<0>&bull;</0>You may file a complaint with the Arbiter for Financial Services only if you are not satisfied with our decision or the decision wasn’t made within 15 business days.'
                                components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                            />,
                            <Localize
                                key={1}
                                i18n_default_text='<0>&bull;</0>The Arbiter for Financial Services will determine whether the complaint can be accepted and is in accordance with the law.'
                                components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                            />,
                            <Localize
                                key={2}
                                i18n_default_text='<0>&bull;</0>If the complaint is accepted by the Arbiter, you will receive another email with further details relating to the payment of the €25 complaint fee and the processes that follow.'
                                components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                            />,
                        ],
                        ending_text: (
                            <Localize
                                i18n_default_text='<0/>For more information on submitting a complaint with the Office of the Arbiter for Financial Services, please <1>see their guidance</1>.'
                                components={[
                                    <br key={0} />,
                                    <a
                                        key={1}
                                        className='link link--orange'
                                        rel='noopener noreferrer'
                                        target='_blank'
                                        href='https://www.financialarbiter.org.mt/content/step-1-complain-your-provider'
                                    />,
                                ]}
                            />
                        ),
                    },
                ],
            },
        },
    ];

    const complaints_procedure = [
        {
            title: localize('Financial commission complaints procedure'),
        },
        {
            title: localize('1. Filing complaints'),
            list: [
                <Localize
                    key={0}
                    i18n_default_text='<0>a.</0>You may file a complaint with the Financial Commission up to 45 days after the incident.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
                <Localize
                    key={1}
                    i18n_default_text='<0>b.</0>The Financial Commission has 5 days to acknowledge that your complaint was received and 14 days to answer the complaint through our Internal Dispute Resolution (IDR) procedure.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
                <Localize
                    key={2}
                    i18n_default_text='<0>c.</0>You will be able to file a complaint with the Financial Commission only if you are not satisfied with our decision or the decision wasn’t made within 14 days.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
            ],
        },
        {
            title: localize('2. Investigation phase'),
            list: [
                <Localize
                    key={0}
                    i18n_default_text='<0>a.</0>The Financial Commission will investigate the validity of the complaint within 5 business days.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
                <Localize
                    key={1}
                    i18n_default_text='<0>b.</0>The Head of the Dispute Resolution Committee (DRC) will contact both you and us within 5 business days to obtain all necessary information and see if there is a chance to settle the complaint during the investigation phase.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
                <Localize
                    key={2}
                    i18n_default_text='<0>c.</0>If no settlement opportunity can be found, the complaint will proceed to the determination phase to be handled by the DRC.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
            ],
        },
        {
            title: localize('3. Determination phase'),
            list: [
                <React.Fragment key={0}>
                    <span className='complaints-policy__list-item-prefix'>a.</span>
                    <span className='complaints-policy__list-item-text'>
                        <Localize
                            i18n_default_text='The DRC will make a <0>decision on the complaint</0> (please note that the DRC mentions no timeframe for announcing its decision).'
                            components={[
                                <a
                                    key={0}
                                    className='link link--orange'
                                    rel='noopener noreferrer'
                                    target='_blank'
                                    href='https://financialcommission.org/resolving-a-dispute/dispute-resolution-process/'
                                />,
                            ]}
                        />
                    </span>
                </React.Fragment>,
                <Localize
                    key={1}
                    i18n_default_text='<0>b.</0>The DRC may request additional information from you or us, who must then provide the requested information within 7 days.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
            ],
        },
        {
            title: localize('4. Awards and orders'),
            list: [
                <Localize
                    key={0}
                    i18n_default_text='<0>a.</0>The decisions made by the DRC are binding on us. DRC decisions are binding on you only if you accept them.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
                <Localize
                    key={1}
                    i18n_default_text='<0>b.</0>If you agree with a DRC decision, you will need to accept it within 14 days. If you do not respond to the DRC decision within 14 days, the complaint is considered closed.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
                <Localize
                    key={2}
                    i18n_default_text='<0>c.</0>We must award the settlement within 28 days of when the decision is reached.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
                <Localize
                    key={3}
                    i18n_default_text='<0>d.</0>If the decision is made in our favour, you must provide a release for us within 7 days of when the decision is made, and the complaint will be considered closed.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
            ],
        },
        {
            title: localize('5. Disclaimer'),
            content: {
                text: localize(
                    'The Financial Commission accepts appeals for 45 days following the date of the incident and only after the trader has tried to resolve the issue with the company directly.'
                ),
            },
        },
    ];

    const can_show_complaints_procedure = /^(svg|labuan|vanuatu)$/.test(landing_company_shortcode);
    const eu_policy_clauses = ['introduction', 'fair_treatment', 'general_queries', 'complaints'];
    const non_eu_policy_clauses = ['introduction', 'fair_treatment', 'complaints_and_disputes'];

    const modal_content = [
        ...policy_content.filter(row =>
            landing_company_shortcode === 'maltainvest'
                ? eu_policy_clauses.includes(row.id)
                : non_eu_policy_clauses.includes(row.id)
        ),
        ...(can_show_complaints_procedure ? complaints_procedure : []),
    ].map((row, index) => (
        <div key={index} className='complaints-policy__section'>
            <div className='complaints-policy__section-title'>{row.title}</div>
            {row.list && (
                <div className='complaints-policy__list'>
                    {row.list.map((item, i) => (
                        <div key={i} className='complaints-policy__list-item'>
                            {item}
                        </div>
                    ))}
                </div>
            )}
            {row.content && (
                <div className='complaints-policy__section-content'>
                    {row.content.text}
                    {row.content.sub_content?.map((item, i) => (
                        <div key={i} className='complaints-policy__subsection'>
                            <div className='complaints-policy__subsection-title'>{item.title}</div>
                            <div className='complaints-policy__subsection-content'>
                                {item?.text}
                                {item.bullets && (
                                    <div className='complaints-policy__subsection-bullet'>
                                        {item.bullets.map((bullet, j) => (
                                            <div key={j} className='complaints-policy__list-item'>
                                                {bullet}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {item?.ending_text}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    ));

    return (
        <div className='complaints-policy'>
            <div className='complaints-policy__wrapper'>{modal_content}</div>
        </div>
    );
});

export default Content;
