import React from 'react';
import html2canvas from 'html2canvas';
import {
    Button,
    Clipboard,
    DesktopWrapper,
    Icon,
    MobileOrTabletWrapper,
    Modal,
    Text,
    useCopyToClipboard,
} from '@deriv/components';
import { websiteUrl } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import SeparatorContainerLine from 'Components/separator-container-line';
import { buy_sell } from 'Constants/buy-sell';
import { ad_type } from 'Constants/floating-rate';
import { TAdvert } from 'Types';
import ShareMyAdsCard from './share-my-ads-card';
import ShareMyAdsSocials from './share-my-ads-socials';

const ShareMyAdsModal = ({ advert }: TAdvert) => {
    const [is_copied, copyToClipboard, setIsCopied] = useCopyToClipboard();
    const { account_currency, advertiser_details, id, local_currency, rate_display, rate_type, type } = advert;
    const { id: advertiser_id } = advertiser_details;
    const { hideModal, is_modal_open } = useModalManagerContext();

    const div_ref = React.useRef(null);
    const advert_url = `${websiteUrl()}cashier/p2p/advertiser?id=${advertiser_id}&advert_id=${id}`;
    const is_buy_ad = type === buy_sell.BUY;
    const custom_message = localize(
        "Hi! I'd like to exchange {{first_currency}} for {{second_currency}} at {{rate_display}}{{rate_type}} on Deriv P2P.nnIf you're interested, check out my ad 👉nn{{- advert_url}}nnThanks!",
        {
            first_currency: is_buy_ad ? local_currency : account_currency,
            second_currency: is_buy_ad ? account_currency : local_currency,
            rate_display,
            rate_type: rate_type === ad_type.FLOAT ? '%' : ` ${local_currency}`,
            advert_url,
        }
    );

    const formatted_message = custom_message.replace(/nn/g, '\n\n');

    const onCopy = (event: { stopPropagation: () => void }) => {
        copyToClipboard(advert_url);
        setIsCopied(true);
        event.stopPropagation();
    };

    const handleGenerateImage = async () => {
        if (div_ref.current) {
            const p2p_logo = div_ref.current.querySelector('.share-my-ads-card__qr-icon');

            if (p2p_logo) {
                const canvas = await html2canvas(div_ref.current, { useCORS: true, allowTaint: true });
                const screenshot = canvas.toDataURL('image/png', 1.0);
                const file_name = `${advert.type}_${advert.id}.png`;
                const link = document.createElement('a');
                link.download = file_name;
                link.href = screenshot;
                link.click();
            }
        }
    };

    const handleShareLink = () => {
        navigator.share({
            text: formatted_message,
        });
    };

    React.useEffect(() => {
        let timeout_clipboard: ReturnType<typeof setTimeout>;
        if (is_copied) {
            timeout_clipboard = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        }
        return () => {
            clearTimeout(timeout_clipboard);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_copied]);

    return (
        <Modal is_open={is_modal_open} title={localize('Share this ad')} toggleModal={hideModal} width='71rem'>
            <Modal.Body className='share-my-ads-modal__body'>
                <React.Fragment>
                    <DesktopWrapper>
                        <Text>
                            <Localize i18n_default_text='Promote your ad by sharing the QR code and link.' />
                        </Text>
                    </DesktopWrapper>
                    <div className='share-my-ads-modal__container'>
                        <div className='share-my-ads-modal__container__card'>
                            <ShareMyAdsCard advert={advert} advert_url={advert_url} div_ref={div_ref} />
                            <Button
                                className='share-my-ads-modal__container__card__download-button'
                                secondary
                                onClick={handleGenerateImage}
                            >
                                <Localize i18n_default_text='Download this QR code' />
                            </Button>
                            <MobileOrTabletWrapper>
                                <Button.Group className='share-my-ads-modal__container__card__button-group'>
                                    <Button icon={<Icon icon='IcShare' />} secondary onClick={handleShareLink}>
                                        <Localize i18n_default_text='Share link' />
                                    </Button>
                                    <Button
                                        icon={
                                            is_copied ? (
                                                <Icon icon='IcCheckmarkCircle' custom_color='var(--status-success)' />
                                            ) : (
                                                <Icon icon='IcShareLink' data_testid='dt_copy_link_icon' />
                                            )
                                        }
                                        secondary
                                        onClick={onCopy}
                                    >
                                        <Localize i18n_default_text='Copy link' />
                                    </Button>
                                </Button.Group>
                            </MobileOrTabletWrapper>
                        </div>
                        <DesktopWrapper>
                            <div className='share-my-ads-modal__share'>
                                <Text weight='bold'>
                                    <Localize i18n_default_text='Share via' />
                                </Text>
                                <ShareMyAdsSocials advert_url={advert_url} custom_message={formatted_message} />
                                <SeparatorContainerLine className='share-my-ads-modal__line' />
                                <Text>
                                    <Localize i18n_default_text='Or copy this link' />
                                </Text>
                                <div className='share-my-ads-modal__copy'>
                                    <Text className='share-my-ads-modal__copy-link' color='less-prominent'>
                                        <Localize i18n_default_text='{{- link}}' values={{ link: advert_url }} />
                                    </Text>
                                    <div className='share-my-ads-modal__copy-clipboard'>
                                        <Clipboard
                                            className='share-my-ads-modal__copy-clipboard--icon'
                                            popoverAlignment='top'
                                            popoverClassName='share-my-ads-modal__copy-clipboard--popover'
                                            size='18'
                                            success_message={localize('Copied!')}
                                            text_copy={advert_url}
                                        />
                                    </div>
                                </div>
                            </div>
                        </DesktopWrapper>
                    </div>
                </React.Fragment>
            </Modal.Body>
        </Modal>
    );
};

export default observer(ShareMyAdsModal);
