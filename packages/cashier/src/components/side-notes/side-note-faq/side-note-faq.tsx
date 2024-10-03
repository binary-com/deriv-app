import React, { useMemo } from 'react';
import { Accordion, SideNote, StaticUrl, Text } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import './side-note-faq.scss';

type TSideNoteFAQProps = {
    transaction_type?: 'deposit' | 'withdraw';
};

const SideNoteFAQ = ({ transaction_type }: TSideNoteFAQProps) => {
    const { client } = useStore();
    const { isMobile } = useDevice();
    const { is_eu } = client;

    const onClickHandler = () => window.LiveChatWidget.call('maximize');

    const deposit_faq_list = useMemo(() => {
        return [
            {
                header: localize("Why can't I see deposited funds in my Deriv account?"),
                content: (
                    <Localize
                        i18n_default_text="We process your deposits internally within 24 hours (depending on internal checks and your payment method). If you don't see your funds reflected after this time, please contact us via <0>live chat</0> with proof of your transaction, including the amount, date, and time."
                        components={[
                            <span key={0} className='link' onClick={onClickHandler} onKeyDown={onClickHandler} />,
                        ]}
                    />
                ),
            },
            {
                header: localize('What do I do if I have reached my deposit limit?'),
                content: (
                    <Localize
                        i18n_default_text="If you've hit the deposit limit, please wait 1-2 hours before trying again. Check that your browser is up to date and use incognito mode. If you still have problems, please contact us via <0>live chat</0>."
                        components={[
                            <span key={0} className='link' onClick={onClickHandler} onKeyDown={onClickHandler} />,
                        ]}
                    />
                ),
            },
            {
                header: localize('Why is my card/e-wallet not working?'),
                content: (
                    <>
                        <Localize i18n_default_text='Here are some common card/e-wallet errors and their solutions:' />
                        <ol className='side-note-faq__accordion-list'>
                            <Text as='li' size='xxs'>
                                <Localize
                                    i18n_default_text='<0>Insufficient balance:</0> Please ensure you have sufficient funds in your card/e-wallet. If the problem persists, please contact your bank for help.'
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                            <Text as='li' size='xxs'>
                                <Localize
                                    i18n_default_text='<0>3D secure invalid/redirected:</0> Please contact your bank for an OTP.'
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                            <Text as='li' size='xxs'>
                                <Localize
                                    i18n_default_text='<0>Restricted card:</0> Please use a locally issued card. '
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                            <Text as='li' size='xxs'>
                                <Localize
                                    i18n_default_text='<0>Do not honour:</0> Please contact your bank for further assistance.'
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                            <Text as='li' size='xxs'>
                                <Localize
                                    i18n_default_text='<0>Customer cancelled payment:</0> Please try again after 1 hour.'
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                        </ol>
                    </>
                ),
            },
            {
                header: localize("Can I use someone else's payment method?"),
                content: (
                    <Localize
                        i18n_default_text="No, you cannot use someone else's payment method to deposit into Deriv. If you use another person's payment method, your account will be suspended (if they are on Deriv, their account will also be suspended). If you suspect that someone has used your payment method, let us know through <0>live chat</0> with your proof of ownership."
                        components={[
                            <span key={0} className='link' onClick={onClickHandler} onKeyDown={onClickHandler} />,
                        ]}
                    />
                ),
            },
        ];
    }, []);

    const withdraw_faq_list = useMemo(() => {
        return [
            {
                header: localize("Why can't I see the funds on my card/e-wallet balance after I've made a withdrawal?"),
                content: (
                    <Localize i18n_default_text="Your withdrawal will be processed internally in one business day. After that, for debit/credit cards, it takes 1-15 working days, and for e-wallets, it's 1-3 working days. If there's a delay beyond these periods, please contact us via live chat." />
                ),
            },
            {
                header: localize("Why can't I use a payment agent to withdraw my funds?"),
                content: (
                    <Localize
                        i18n_default_text='If you have used a different payment method to make your deposit, you cannot withdraw via a payment agent. However, if you have used both a payment agent and another payment method (for example, an e-wallet) to deposit, you have to withdraw via the e-wallet first up to your original deposited amount. After that, you can use a payment agent to make a withdrawal. If your original payment method is not available for withdrawals, please let us know through <0>live chat</0> for assistance.'
                        components={[
                            <span key={0} className='link' onClick={onClickHandler} onKeyDown={onClickHandler} />,
                        ]}
                    />
                ),
            },
            {
                header: localize('How do I cancel my withdrawal?'),
                content: (
                    <Localize i18n_default_text="Withdrawals can be cancelled if they're still in the 'Requested' status (you can check your status under Pending payout). Once the status changes to 'Authorised', in 'Progress', or 'Processed', cancellation isn't possible." />
                ),
            },
            {
                header: localize('Can I withdraw using a different method?'),
                content: (
                    <Localize i18n_default_text='No, withdrawals must be made using the same method you used for your deposit.' />
                ),
            },
        ];
    }, []);

    return (
        <SideNote
            description={
                <Text size={!isMobile ? 'xs' : 'xxs'} weight='bold'>
                    <Localize i18n_default_text='FAQ' />
                </Text>
            }
        >
            {transaction_type === 'deposit' && (
                <Accordion
                    className='side-note-faq__accordion'
                    icon_close='IcChevronDown'
                    icon_open='IcCashierChevronUp'
                    list={deposit_faq_list}
                />
            )}
            {transaction_type === 'withdraw' && (
                <Accordion
                    className='side-note-faq__accordion'
                    icon_close='IcChevronDown'
                    icon_open='IcCashierChevronUp'
                    list={withdraw_faq_list}
                />
            )}
            <Text size='xxs'>
                <Localize
                    i18n_default_text='<0>View more</0>'
                    components={[
                        <StaticUrl key={0} className='link' href='help-centre' is_document={false} is_eu_url={is_eu} />,
                    ]}
                />
            </Text>
        </SideNote>
    );
};

export default SideNoteFAQ;
