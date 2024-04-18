import React, { memo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AdErrorTooltipModal, AdRateSwitchModal, MyAdsDeleteModal } from '@/components/Modals';
import { ShareAdsModal } from '@/components/Modals/ShareAdsModal';
import { AD_ACTION, MY_ADS_URL } from '@/constants';
import { useFloatingRate, useModalManager } from '@/hooks';
import { getVisibilityErrorCodes } from '@/utils';
import { p2p } from '@deriv/api-v2';
import { TMyAdsTableRowRendererProps } from '../MyAdsTable/MyAdsTable';
import MyAdsTableRow from './MyAdsTableRow';

const MyAdsTableRowView = ({
    balanceAvailable,
    dailyBuyLimit,
    dailySellLimit,
    isListed,
    ...rest
}: TMyAdsTableRowRendererProps) => {
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const { rateType: currentRateType, reachedTargetDate } = useFloatingRate();
    const { mutate } = p2p.advert.useUpdate();
    const { error, isError, isSuccess, mutate: deleteAd } = p2p.advert.useDelete();
    const history = useHistory();

    const {
        account_currency: accountCurrency,
        id = '',
        rate_type: rateType,
        remaining_amount: remainingAmount,
        type,
        visibility_status: visibilityStatus = [],
    } = rest;

    useEffect(() => {
        if (isError && error?.error?.message) {
            showModal('MyAdsDeleteModal');
        }
    }, [error?.error?.message, isError, isSuccess, showModal]);

    const onClickIcon = (action: string) => {
        //TODO: to implement the onclick actions for share and edit.
        switch (action) {
            case AD_ACTION.ACTIVATE:
                mutate({ id, is_active: 1 });
                break;
            case AD_ACTION.DEACTIVATE:
                mutate({ id, is_active: 0 });
                break;
            case AD_ACTION.DELETE: {
                showModal('MyAdsDeleteModal');
                break;
            }
            case AD_ACTION.SHARE: {
                showModal('ShareAdsModal');
                break;
            }
            case AD_ACTION.EDIT: {
                history.push(`${MY_ADS_URL}/adForm?formAction=edit&advertId=${id}`);
                break;
            }
            default:
                break;
        }
    };
    const onClickDelete = () => {
        deleteAd({ id });
        hideModal();
    };
    return (
        <>
            <MyAdsTableRow
                currentRateType={currentRateType}
                isListed={isListed}
                showModal={showModal}
                {...rest}
                onClickIcon={onClickIcon}
            />
            <AdErrorTooltipModal
                accountCurrency={accountCurrency}
                advertType={type}
                balanceAvailable={balanceAvailable}
                dailyBuyLimit={dailyBuyLimit}
                dailySellLimit={dailySellLimit}
                isModalOpen={!!isModalOpenFor('AdErrorTooltipModal')}
                onRequestClose={hideModal}
                remainingAmount={remainingAmount}
                visibilityStatus={getVisibilityErrorCodes(visibilityStatus, rateType !== currentRateType, isListed)}
            />
            <MyAdsDeleteModal
                error={error?.error?.message}
                id={id}
                isModalOpen={!!isModalOpenFor('MyAdsDeleteModal') || !!error?.error?.message}
                onClickDelete={onClickDelete}
                onRequestClose={hideModal}
            />
            <ShareAdsModal id={id} isModalOpen={!!isModalOpenFor('ShareAdsModal')} onRequestClose={hideModal} />
            <AdRateSwitchModal
                isModalOpen={!!isModalOpenFor('AdRateSwitchModal')}
                onClickSet={() => onClickIcon(AD_ACTION.EDIT)}
                onRequestClose={hideModal}
                rateType={currentRateType}
                reachedEndDate={reachedTargetDate}
            />
        </>
    );
};

export default memo(MyAdsTableRowView);
