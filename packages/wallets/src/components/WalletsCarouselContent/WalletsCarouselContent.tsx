import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel, { EmblaCarouselType, EmblaEventType } from 'embla-carousel-react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useCurrencyConfig, useMobileCarouselWalletsList } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import useAllBalanceSubscription from '../../hooks/useAllBalanceSubscription';
import useIsRtl from '../../hooks/useIsRtl';
import useWalletAccountSwitcher from '../../hooks/useWalletAccountSwitcher';
import { THooks } from '../../types';
import { ProgressBar } from '../Base';
import { WalletsCarouselLoader } from '../SkeletonLoader';
import { WalletCard } from '../WalletCard';
import { WalletListCardActions } from '../WalletListCardActions';
import './WalletsCarouselContent.scss';

type TProps = {
    accountsActiveTabIndex: number;
};

const numberWithinRange = (number: number, min: number, max: number): number => Math.min(Math.max(number, min), max);

// scale based on the width difference between active wallet (288px) and inactive wallets + padding (240px + 16px)
const TRANSITION_FACTOR_SCALE = 1 - 25.6 / 28.8;

/**
 * carousel component
 * idea behind data flow here:
 * - Embla is the SINGLE SOURCE OF TRUTH for current active card, so the state flow / data flow is simple
 * - everything else gets in sync with Embla eventually
 */
const WalletsCarouselContent: React.FC<TProps> = ({ accountsActiveTabIndex }) => {
    const switchWalletAccount = useWalletAccountSwitcher();
    const isRtl = useIsRtl();
    const history = useHistory();

    const { data: walletAccountsList, isLoading: isWalletAccountsListLoading } = useMobileCarouselWalletsList();
    const { data: activeWallet, isLoading: isActiveWalletLoading } = useActiveWalletAccount();
    const { data: balanceData } = useAllBalanceSubscription();
    const { isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    const [selectedLoginId, setSelectedLoginId] = useState('');
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

    // for the embla "on select" callback
    // to avoid unbinding / cleaning etc, just let it use up-to-date list
    const walletsAccountsListRef = useRef(walletAccountsList);
    const transitionNodes = useRef<HTMLElement[]>([]);
    const transitionFactor = useRef(0);

    const getBalance = (
        loginid: string,
        currency?: string,
        wallet?: ReturnType<typeof useActiveWalletAccount>['data']
    ) => {
        return displayMoney(balanceData?.[loginid]?.balance, currency, {
            fractional_digits: wallet?.currency_config?.fractional_digits,
        });
    };

    // sets the transition nodes to be scaled
    const setTransitionNodes = useCallback((walletsCarouselEmblaApi: EmblaCarouselType) => {
        // find and store all available wallet card containers for the transition nodes
        transitionNodes.current = walletsCarouselEmblaApi.slideNodes().map(slideNode => {
            return slideNode.querySelector('.wallets-card__container') as HTMLElement;
        });
    }, []);

    // function to set the transition factor based on the number of scroll snaps
    const setTransitionFactor = useCallback((walletsCarouselEmblaApi: EmblaCarouselType) => {
        transitionFactor.current = TRANSITION_FACTOR_SCALE * walletsCarouselEmblaApi.scrollSnapList().length;
    }, []);

    // function to interpolate the scale of wallet cards based on scroll events
    const transitionScale = useCallback(
        (walletsCarouselEmblaApi: EmblaCarouselType, walletsCarouselEvent?: EmblaEventType) => {
            const engine = walletsCarouselEmblaApi.internalEngine();
            const scrollProgress = walletsCarouselEmblaApi.scrollProgress();
            const slidesInView = walletsCarouselEmblaApi.slidesInView();
            const isScrollEvent = walletsCarouselEvent === 'scroll';

            walletsCarouselEmblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
                //scrollProgress returns the progress for the whole list with a value of 0<x<1 while scrollSnap return the position of the item in the array
                //difference between the array item position and the progress in the whole scroll event is calculated to determine the transition value
                let diffToTarget = scrollSnap - scrollProgress;
                const slidesInSnap = engine.slideRegistry[snapIndex];

                slidesInSnap.forEach(slideIndex => {
                    if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

                    // iterate through the loop points in the carousel engine using the embla API internal engine
                    if (engine.options.loop) {
                        engine.slideLooper.loopPoints.forEach(loopItem => {
                            const target = loopItem.target();

                            // determine the direction of the loop based on the sign and adjust the difference to the target based on loop direction
                            if (slideIndex === loopItem.index && target !== 0) {
                                const sign = Math.sign(target);

                                if (sign === -1) {
                                    diffToTarget = scrollSnap - (1 + scrollProgress);
                                }
                                if (sign === 1) {
                                    diffToTarget = scrollSnap + (1 - scrollProgress);
                                }
                            }
                        });
                    }

                    // calculate transition scale value based on the scroll position
                    // active wallet will scale down until it reaches the point where width is 24rem and vice versa
                    const transitionValue = 1 - Math.abs(diffToTarget * transitionFactor.current);
                    const scale = numberWithinRange(transitionValue, 0, 1).toString();

                    // apply the scale to the wallet cards
                    const transitionNode = transitionNodes.current[slideIndex];
                    transitionNode.style.transform = `scale(${scale})`;
                });
            });
        },
        []
    );

    const [walletsCarouselEmblaRef, walletsCarouselEmblaApi] = useEmblaCarousel({
        containScroll: false,
        direction: isRtl ? 'rtl' : 'ltr',
        skipSnaps: true,
    });

    const handleCardClick = useCallback(
        (account: THooks.ActiveWalletAccount, index: number) => {
            walletsCarouselEmblaApi?.scrollTo(index);
            walletAccountsList && setSelectedLoginId(walletAccountsList[index].loginid);
            account.is_active &&
                (account.is_virtual
                    ? history.push('/wallet/reset-balance', { accountsActiveTabIndex })
                    : history.push('/wallet/deposit', { accountsActiveTabIndex }));
        },
        [walletsCarouselEmblaApi, walletAccountsList, history, accountsActiveTabIndex]
    );

    useEffect(() => {
        walletsAccountsListRef.current = walletAccountsList;
    }, [walletAccountsList]);

    // set login ID once wallet changes
    useEffect(() => {
        if (activeWallet?.loginid) {
            setSelectedLoginId(activeWallet?.loginid);
        }
    }, [activeWallet?.loginid]);

    // bind to embla events
    useEffect(() => {
        walletsCarouselEmblaApi?.on('select', () => {
            const index = walletsCarouselEmblaApi?.selectedScrollSnap();
            if (index === undefined) {
                return;
            }
            const loginId = walletsAccountsListRef?.current?.[index]?.loginid;

            loginId && setSelectedLoginId(loginId);
        });

        return () => {
            walletsCarouselEmblaApi?.off('select', () => {
                const index = walletsCarouselEmblaApi?.selectedScrollSnap();
                if (index === undefined) {
                    return;
                }
                const loginId = walletsAccountsListRef?.current?.[index]?.loginid;

                loginId && setSelectedLoginId(loginId);
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletsCarouselEmblaApi]);

    // load active wallet whenever its scrolled
    useEffect(() => {
        if (selectedLoginId) {
            switchWalletAccount(selectedLoginId).then(() => {
                const index = walletAccountsList?.findIndex(({ loginid }) => loginid === selectedLoginId) ?? -1;
                if (index !== -1) {
                    walletsCarouselEmblaApi?.scrollTo(index);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLoginId, walletAccountsList]);

    // initial loading
    useEffect(() => {
        if (walletsCarouselEmblaApi && isInitialDataLoaded) {
            const index = walletAccountsList?.findIndex(({ loginid }) => loginid === selectedLoginId) ?? -1;
            if (index !== -1) {
                walletsCarouselEmblaApi?.scrollTo(index, true);
            }

            walletsCarouselEmblaApi && setTransitionNodes(walletsCarouselEmblaApi);
            walletsCarouselEmblaApi && setTransitionFactor(walletsCarouselEmblaApi);
            walletsCarouselEmblaApi && transitionScale(walletsCarouselEmblaApi);

            walletsCarouselEmblaApi
                ?.on('reInit', setTransitionNodes)
                .on('reInit', setTransitionFactor)
                .on('reInit', transitionScale)
                .on('scroll', transitionScale);

            return () => {
                walletsCarouselEmblaApi
                    ?.off('reInit', setTransitionNodes)
                    .off('reInit', setTransitionFactor)
                    .off('reInit', transitionScale)
                    .off('scroll', transitionScale);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletsCarouselEmblaApi, isInitialDataLoaded, transitionScale]);

    useEffect(() => {
        const index = walletAccountsList?.findIndex(({ loginid }) => loginid === selectedLoginId) ?? -1;
        if (index >= 0) {
            setCurrentIndex(index);
        }
    }, [selectedLoginId, walletAccountsList]);

    // set the initial data loading flag to false once all "is loading" flags are false,
    // as then and only then we can display all the stuff and we want to display it permanently after that
    useEffect(() => {
        if (!isWalletAccountsListLoading && !isActiveWalletLoading && !isCurrencyConfigLoading) {
            setIsInitialDataLoaded(true);
        }
    }, [isWalletAccountsListLoading, isActiveWalletLoading, isCurrencyConfigLoading]);

    if (!isInitialDataLoaded) {
        return <WalletsCarouselLoader />;
    }

    return (
        <div className='wallets-carousel-content'>
            <div className='wallets-carousel-content__wrapper'>
                <div className='wallets-carousel-content__title'>
                    <Text size='xl' weight='bold'>
                        <Localize i18n_default_text='Trader’s Hub' />
                    </Text>
                </div>
                <div className='wallets-carousel-content__carousel' ref={walletsCarouselEmblaRef}>
                    <div className='wallets-carousel-content__cards'>
                        {walletAccountsList?.map((account, index) => (
                            <WalletCard
                                balance={
                                    account.loginid === activeWallet?.loginid
                                        ? getBalance(activeWallet?.loginid, activeWallet?.currency, activeWallet)
                                        : getBalance(account.loginid, account?.currency, account)
                                }
                                currency={account.currency || 'USD'}
                                iconSize='lg'
                                isCarouselContent
                                isDemo={account.is_virtual}
                                key={`wallet-card-${account.loginid}`}
                                onClick={() => handleCardClick(account, index)}
                            />
                        ))}
                    </div>
                    <div className='wallets-carousel-content__progress-bar'>
                        <ProgressBar
                            activeIndex={currentIndex}
                            count={walletAccountsList?.length ?? 0}
                            onClick={walletsCarouselEmblaApi?.scrollTo}
                        />
                    </div>
                </div>
            </div>
            <WalletListCardActions accountsActiveTabIndex={accountsActiveTabIndex} />
        </div>
    );
};

export default WalletsCarouselContent;
