import React from 'react';
import { toPng } from 'html-to-image';
import {
    Button,
    Clipboard,
    DesktopWrapper,
    Icon,
    MobileWrapper,
    Modal,
    Text,
    useCopyToClipboard,
} from '@deriv/components';
import { websiteUrl } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import MyProfileSeparatorContainer from 'Pages/my-profile/my-profile-separator-container';
import { buy_sell } from 'Constants/buy-sell';
import { ad_type } from 'Constants/floating-rate';
import { TAdvert } from 'Types';
import ShareMyAdsCard from './share-my-ads-card';
import ShareMyAdsSocials from './share-my-ads-socials';

const ShareMyAdsModal = ({ advert }: TAdvert) => {
    const [is_download_disabled, setIsDownloadDisabled] = React.useState(true);
    const [is_copied, copyToClipboard, setIsCopied] = useCopyToClipboard();
    const { account_currency, advertiser_details, id, local_currency, rate_display, rate_type, type } = advert;
    const { id: advertiser_id } = advertiser_details;
    const { hideModal, is_modal_open } = useModalManagerContext();

    const divRef = React.useRef(null);
    const advert_url = `${websiteUrl()}cashier/p2p/advertiser?id=${advertiser_id}&advert_id=${id}`;
    const is_buy_ad = type === buy_sell.BUY;
    const custom_message = localize(
        "Hi! I'd like to exchange {{first_currency}} for {{second_currency}} at {{rate_display}}{{rate_type}} on Deriv P2P.\n\nIf you're interested, check out my ad 👉\n\n{{- advert_url}}\n\nThanks!",
        {
            first_currency: is_buy_ad ? local_currency : account_currency,
            second_currency: is_buy_ad ? account_currency : local_currency,
            rate_display,
            rate_type: rate_type === ad_type.FLOAT ? '%' : ` ${local_currency}`,
            advert_url,
        }
    );

    const onCopy = (event: { stopPropagation: () => void }) => {
        copyToClipboard(advert_url);
        setIsCopied(true);
        event.stopPropagation();
    };

    const handleGenerateImage = async () => {
        if (divRef.current) {
            const file_name = `${advert.type}_${advert.id}.png`;
            const dataUrl = await toPng(divRef.current);
            const link = document.createElement('a');
            link.download = file_name;
            link.href = dataUrl;
            link.click();
        }
    };

    const handleShareLink = () => {
        navigator.share({
            text: custom_message,
        });
    };

    React.useEffect(() => {
        if (divRef.current) {
            const span = divRef.current.querySelector('.share-my-ads-card__qr-text');

            if (span) {
                const div_styles = getComputedStyle(divRef.current);
                const text_styles = getComputedStyle(span);

                const font_family = div_styles.getPropertyValue('font-family');
                const margin = text_styles.getPropertyValue('margin');

                if (
                    font_family === '"IBM Plex Sans", sans-serif' &&
                    divRef.current.classList.contains('share-my-ads-card') &&
                    margin === '15px 0px 0px'
                ) {
                    setIsDownloadDisabled(false);
                }
            }
        }
    }, [divRef.current]);

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
                            <ShareMyAdsCard advert={advert} advert_url={advert_url} divRef={divRef} />
                            <Button
                                className='share-my-ads-modal__container__card__download-button'
                                disabled={is_download_disabled}
                                secondary
                                onClick={handleGenerateImage}
                            >
                                <Localize i18n_default_text='Download this QR code' />
                            </Button>
                            <MobileWrapper>
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
                            </MobileWrapper>
                        </div>
                        <DesktopWrapper>
                            <div className='share-my-ads-modal__share'>
                                <Text weight='bold'>
                                    <Localize i18n_default_text='Share via' />
                                </Text>
                                <ShareMyAdsSocials advert_url={advert_url} custom_message={custom_message} />
                                <MyProfileSeparatorContainer.Line
                                    className='share-my-ads-modal__line'
                                    is_invisible={false}
                                />
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
