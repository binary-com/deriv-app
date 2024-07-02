import React, { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import {
    useAllWalletAccounts,
    useAuthorize,
    useCtraderAccountsList,
    useDxtradeAccountsList,
    useSortedMT5Accounts,
} from '@deriv/api-v2';
import useDevice from '../../hooks/useDevice';
import useWalletAccountSwitcher from '../../hooks/useWalletAccountSwitcher';
import { useModal } from '../ModalProvider';
import {
    TooltipComponent,
    walletsOnboardingLocalStorageKey as key,
    walletsOnboardingStartValue as START_VALUE,
} from './WalletTourGuideSettings';
import { desktopStepTourGuide, mobileStepTourGuide } from './WalletTourGuideSteps';

const WalletTourGuide = () => {
    const [walletsOnboarding, setWalletsOnboarding] = useLocalStorage(key, useReadLocalStorage(key) ?? '');
    const [run, setRun] = useState(false);
    const { isMobile } = useDevice();
    const modal = useModal();

    const switchWalletAccount = useWalletAccountSwitcher();
    const { isFetching, isLoading, isSuccess } = useAuthorize();
    const { isFetching: ctraderIsLoading } = useCtraderAccountsList();
    const { isFetching: dxtradeIsLoading } = useDxtradeAccountsList();
    const { isFetching: sortedAccountsIsLoading } = useSortedMT5Accounts();
    const { data: availableWallets } = useAllWalletAccounts();

    const needToStart = walletsOnboarding === START_VALUE;
    const isEverythingLoaded =
        !isLoading && !isFetching && isSuccess && !ctraderIsLoading && !dxtradeIsLoading && !sortedAccountsIsLoading;
    const allWalletsAreAdded = Boolean(availableWallets?.every(wallet => wallet.is_added));

    useEffect(() => {
        if (needToStart && modal.isOpen) {
            modal.hide();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [needToStart, modal.isOpen]);

    useEffect(() => {
        if (needToStart && isEverythingLoaded) {
            setWalletsOnboarding('');
            setRun(true);
        }
    }, [run, setRun, needToStart, isEverythingLoaded, switchWalletAccount, setWalletsOnboarding]);

    const callbackHandle = async (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
        if (finishedStatuses.includes(status)) {
            setRun(false);
        }
    };

    return (
        <Joyride
            callback={callbackHandle}
            continuous
            disableCloseOnEsc
            disableOverlayClose
            floaterProps={{ disableAnimation: true }}
            run={run}
            scrollOffset={isMobile ? 100 : 80}
            steps={isMobile ? mobileStepTourGuide(allWalletsAreAdded) : desktopStepTourGuide(allWalletsAreAdded)}
            tooltipComponent={TooltipComponent}
        />
    );
};

export default WalletTourGuide;
