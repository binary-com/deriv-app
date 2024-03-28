import React, { memo, MouseEvent, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Clipboard } from '@/components';
import { BUY_SELL, RATE_TYPE } from '@/constants';
import { useCopyToClipboard } from '@/hooks';
import { p2p } from '@deriv/api-v2';
import { Button, Divider, Modal, Text, useDevice } from '@deriv-com/ui';
//TODO: replace below icons with the one from quill once available
import CheckmarkCircle from '../../../public/ic-checkmark-circle.svg';
import ShareIcon from '../../../public/ic-share.svg';
import ShareLinkIcon from '../../../public/ic-share-link.svg';
import ShareMyAdsCard from './ShareAdsCard';
import ShareMyAdsSocials from './ShareAdsSocials';
import './ShareAdsModal.scss';

type TShareAdsModalProps = {
    id: string;
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const websiteUrl = () => `${location.protocol}//${location.hostname}/`;

const ShareAdsModal = ({ id, isModalOpen, onRequestClose }: TShareAdsModalProps) => {
    const timeoutClipboardRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { isDesktop, isMobile } = useDevice();
    const { data: advertInfo, isLoading: isLoadingInfo } = p2p.advert.useGet({ id });
    const [isCopied, copyToClipboard, setIsCopied] = useCopyToClipboard();
    const {
        account_currency: accountCurrency,
        advertiser_details: advertiserDetails,
        local_currency: localCurrency,
        rate_display: rateDisplay,
        rate_type: rateType,
        type,
    } = advertInfo ?? {};
    const { id: advertiserId } = advertiserDetails ?? {};

    const divRef = useRef<HTMLDivElement | null>(null);
    const advertUrl = `${websiteUrl()}cashier/p2p/advertiser?id=${advertiserId}&advert_id=${id}`;
    const isBuyAd = type === BUY_SELL.BUY;
    const firstCurrency = isBuyAd ? localCurrency : accountCurrency;
    const secondCurrency = isBuyAd ? accountCurrency : localCurrency;
    const adRateType = rateType === RATE_TYPE.FLOAT ? '%' : ` ${localCurrency}`;
    const customMessage = `Hi! I'd like to exchange ${firstCurrency} for ${secondCurrency} at ${rateDisplay}${adRateType} on Deriv P2P.\n\nIf you're interested, check out my ad 👉\n\n${advertUrl} \n\nThanks!`;

    const onCopy = (event: MouseEvent) => {
        copyToClipboard(advertUrl);
        setIsCopied(true);
        timeoutClipboardRef.current = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
        event.stopPropagation();
    };

    const handleGenerateImage = async () => {
        if (divRef.current) {
            const p2pLogo = divRef.current.querySelector('.p2p-v2-share-ads-card__qr-icon');
            if (p2pLogo) {
                const canvas = await html2canvas(divRef.current, { allowTaint: true, useCORS: true });
                const screenshot = canvas.toDataURL('image/png', 1.0);
                const fileName = `${type}_${id}.png`;
                const link = document.createElement('a');
                link.download = fileName;
                link.href = screenshot;
                link.click();
            }
        }
    };

    const handleShareLink = () => {
        navigator.share({
            text: customMessage,
        });
    };

    useEffect(() => {
        return () => {
            if (timeoutClipboardRef.current) {
                clearTimeout(timeoutClipboardRef.current);
            }
        };
    }, []);

    return (
        <>
            {!isLoadingInfo && (
                <Modal
                    ariaHideApp={false}
                    className='p2p-v2-share-ads-modal'
                    isOpen={isModalOpen}
                    onRequestClose={onRequestClose}
                    testId='dt_p2p_v2_share_ads_modal'
                >
                    <Modal.Header className='px-0 py-4 lg:pb-16 h-0' hideBorder onRequestClose={onRequestClose}>
                        <Text weight='bold'>Share this ad</Text>
                    </Modal.Header>
                    <Modal.Body>
                        {isDesktop && <Text>Promote your ad by sharing the QR code and link.</Text>}
                        <div className='p2p-v2-share-ads-modal__container'>
                            <div className='p2p-v2-share-ads-modal__container__card'>
                                <ShareMyAdsCard advert={advertInfo} advertUrl={advertUrl} ref={divRef} />
                                <Button
                                    className='border-[1px]'
                                    color='black'
                                    isFullWidth={isMobile}
                                    onClick={handleGenerateImage}
                                    textSize={isMobile ? 'md' : 'sm'}
                                    variant='outlined'
                                >
                                    Download this QR code
                                </Button>
                                {isMobile && (
                                    <div className='flex w-full gap-4 justify-between mt-6'>
                                        <Button
                                            className='p2p-v2-share-ads-modal__container__card__button'
                                            color='black'
                                            onClick={handleShareLink}
                                            textSize='md'
                                            variant='outlined'
                                        >
                                            <ShareIcon />
                                            Share link
                                        </Button>
                                        <Button
                                            className='p2p-v2-share-ads-modal__container__card__button'
                                            color='black'
                                            onClick={onCopy}
                                            textSize='md'
                                            variant='outlined'
                                        >
                                            {isCopied ? <CheckmarkCircle /> : <ShareLinkIcon />}
                                            Copy link
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {isDesktop && (
                                <div className='pl-[2.4rem] w-[52%]'>
                                    <Text weight='bold'>Share via</Text>
                                    <ShareMyAdsSocials advertUrl={advertUrl} customMessage={customMessage} />
                                    <Divider margin='0 0 2.5rem 0' />
                                    <Text>Or copy this link</Text>
                                    <div className='p2p-v2-share-ads-modal__copy'>
                                        <Text
                                            className='p2p-v2-share-ads-modal__copy-link'
                                            color='less-prominent'
                                            size='sm'
                                        >
                                            {advertUrl}
                                        </Text>
                                        {/* TODO: clipboard to be replaced */}
                                        <div className='p2p-v2-share-ads-modal__copy-clipboard'>
                                            <Clipboard textCopy={advertUrl} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

export default memo(ShareAdsModal);
