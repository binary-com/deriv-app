import React from 'react';
import { Icon, Modal, Popover, StaticUrl } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { deriv_urls } from '@deriv/shared';
import MGALogo from 'Assets/SvgComponents/footer/mga.svg';

const MLTRegulatoryInformation = () => (
    <div className='footer-regulatory-information'>
        <div className='footer-regulatory-information__icon'>
            <MGALogo />
        </div>
        <p>
            <Localize
                i18n_default_text='Synthetic indices in the EU and the UK are offered by Deriv (Europe) Limited, W Business Centre, Level 3, Triq Dun Karm, Birkirkara BKR 9033, Malta, licensed and regulated by the Malta Gaming Authority (<0>licence no. MGA/B2C/102/2000</0>), by the Gambling Commission for clients in Great Britain under <1>account no. 39495</1>, and by the Revenue Commissioners for clients in Ireland (<2>licence no. 1010285</2>).'
                components={[
                    <StaticUrl
                        href='/regulatory/Deriv_(Europe)_Limited.pdf'
                        key={0}
                        className='footer-regulatory-information__link'
                        is_document
                    />,
                    <a
                        href='https://www.gamblingcommission.gov.uk/public-register/business/detail/39495'
                        key={1}
                        className='footer-regulatory-information__link'
                    />,
                    <a
                        href={`https://${deriv_urls.DERIV_HOST_NAME}/regulatory/DEL_Remote_Bookmarker_License.pdf`}
                        target='_blank'
                        rel='nofollow noreferrer'
                        key={2}
                        className='footer-regulatory-information__link'
                    />,
                ]}
            />
        </p>
    </div>
);

const MXRegulatoryInformation = () => (
    <div className='footer-regulatory-information'>
        <p>
            <Localize
                i18n_default_text='Synthetic indices in the UK and the Isle of Man are offered by Deriv (MX) Ltd, Millennium House, Level 1, Victoria Road, Douglas IM2 4RW, Isle of Man, licensed and regulated in Great Britain by the Gambling Commission under <0>account no. 39172</0> and by the Gambling Supervision Commission in the Isle of Man (<1>view licence</1>).'
                components={[
                    <a
                        href='https://www.gamblingcommission.gov.uk/public-register/business/detail/39172'
                        target='_blank'
                        rel='nofollow noreferrer'
                        key={0}
                        className='footer-regulatory-information__link'
                    />,
                    <a
                        href={`https://${deriv_urls.DERIV_HOST_NAME}/regulatory/Deriv_(MX)_Ltd.pdf`}
                        target='_blank'
                        rel='nofollow noreferrer'
                        key={1}
                        className='footer-regulatory-information__link'
                    />,
                ]}
            />
        </p>
    </div>
);

const MFRegulatoryInformation = () => (
    <div className='footer-regulatory-information'>
        <p>
            <Localize
                i18n_default_text='Financial products in the EU are offered by Deriv Investments (Europe) Limited, licensed as a Category 3 Investment Services provider by the Malta Financial Services Authority (<0>licence no. IS/70156</0>).'
                components={[
                    <a
                        href={`https://${deriv_urls.DERIV_HOST_NAME}/regulatory/Deriv_Investments_(Europe)_Limited.pdf`}
                        target='_blank'
                        rel='nofollow noreferrer'
                        key={0}
                        className='footer-regulatory-information__link'
                    />,
                ]}
            />
        </p>
    </div>
);

export const RegulatoryInformation = ({ landing_company, is_eu }) => {
    const [should_show_modal, showModal] = React.useState(false);
    if (!is_eu) return null;
    const is_mx = landing_company === 'iom';
    const is_mlt = landing_company === 'malta';
    const is_mf = landing_company === 'maltainvest';

    return (
        <div className='footer__link'>
            <Popover alignment='top' message={localize('Regulatory Information')}>
                <a onClick={() => showModal(true)}>
                    <Icon icon='IcRegulatoryInformation' className='footer__icon ic-deriv__icon' />
                </a>
            </Popover>
            <Modal
                is_open={should_show_modal}
                small
                has_close_icon
                toggleModal={() => showModal(false)}
                title={localize('Regulatory Information')}
            >
                {is_mx && <MXRegulatoryInformation />}
                {is_mlt && <MLTRegulatoryInformation />}
                {is_mf && <MFRegulatoryInformation />}
            </Modal>
        </div>
    );
};
