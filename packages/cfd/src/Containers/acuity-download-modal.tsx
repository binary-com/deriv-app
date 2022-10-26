import React from 'react';
import { Button, Modal, Text, Icon } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getUrlBase } from '@deriv/shared';
import RootStore from 'Stores/index';

type TAcuityDownloadModal = {
    is_acuity_modal_open: boolean;
    setIsAcuityModalOpen: (value: boolean) => void;
};

const AcuityDownloadModal = ({ is_acuity_modal_open, setIsAcuityModalOpen }: TAcuityDownloadModal) => {
    const closeModal = () => setIsAcuityModalOpen(false);

    const openDownloadLink = () => {
        window.open(
            'https://dashboard.acuitytrading.com/metatrader/DownloadMt5Installer?apiKey=2713b8d0-43ed-4194-b5d7-b1ff60dbdae0&isFull=true',
            '_blank',
            'noopener,noreferrer'
        );
        closeModal();
    };

    return (
        <Modal
            is_open={is_acuity_modal_open}
            title=' '
            has_close_icon={true}
            className='acuity-download-modal'
            width='44rem'
            toggleModal={closeModal}
        >
            <div className='acuity-download-modal__body'>
                <div className='acuity-download-modal__body--image'>
                    <img src={getUrlBase('/public/images/common/acuity_modal.png')} />
                </div>
                <Text as='p' size='s' weight='bold' align='center'>
                    <Localize i18n_default_text='Power up your trades with cool new tools' />
                </Text>
                <div className='acuity-download-modal__body--description'>
                    <Text as='p' size='s' line_height='m' align='center'>
                        <Localize
                            i18n_default_text="We/'ve partnered with Acuity to give you a suite of intuitive trading tools for MT5 so you can keep track of market events and trends, free of charge! <0/><0/>
                    Download the Acuity suite and take advantage of the <1>Macroeconomic Calendar, Market Alerts, Research Terminal,</1> and <1>Signal Centre Trade Ideas</1> without leaving your MT5 terminal.<0/><0/>
                    This suite is only available for Windows, and is most recommended for financial assets."
                            components={[<br key={0} />, <Text key={1} size='s' weight='bold' />]}
                        />
                    </Text>
                </div>
                <div className='acuity-download-modal__body--info'>
                    <Icon icon='ic-info-blue' />
                    <Text as='p' size='xxxs' line_height='s'>
                        <Localize i18n_default_text='Disclaimer: The trading services and information provided by Acuity should not be construed as a solicitation to invest and/or trade. Deriv does not offer investment advice. The past is not a guide to future performance, and strategies that have worked in the past may not work in the future.' />
                    </Text>
                </div>
                <div className='acuity-download-modal__body--button'>
                    <Button type='button' text={localize('Download Acuity')} primary large onClick={openDownloadLink} />
                </div>
            </div>
        </Modal>
    );
};

export default connect(({ ui }: RootStore) => ({
    is_acuity_modal_open: ui.is_acuity_modal_open,
    setIsAcuityModalOpen: ui.setIsAcuityModalOpen,
}))(AcuityDownloadModal);
