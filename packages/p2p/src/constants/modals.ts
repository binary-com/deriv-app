import React from 'react';

export const Modals = {
    AdCancelModal: React.lazy(
        () => import(/* webpackChunkName: "ad-cancel-modal" */ 'Components/modal-manager/modals/ad-cancel-modal')
    ),
    AdCreatedModal: React.lazy(
        () => import(/* webpackChunkName: "ad-created-modal" */ 'Components/modal-manager/modals/ad-created-modal')
    ),
    AdCreateEditErrorModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "ad-create-edit-error-modal" */ 'Components/modal-manager/modals/ad-create-edit-error-modal'
            )
    ),
    AddPaymentMethodErrorModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "add-payment-method-error-modal" */ 'Components/modal-manager/modals/add-payment-method-error-modal'
            )
    ),
    AdErrorTooltipModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "ad-error-tooltip-modal" */ 'Components/modal-manager/modals/ad-error-tooltip-modal'
            )
    ),
    AdVisibilityErrorModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "ad-visibility-error-modal" */ 'Components/modal-manager/modals/ad-visibility-error-modal'
            )
    ),
    BuySellModal: React.lazy(
        () => import(/* webpackChunkName: "buy-sell-modal" */ 'Components/modal-manager/modals/buy-sell-modal')
    ),
    BlockUserFilterModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "block-user-filter-modal" */ 'Components/modal-manager/modals/block-user-filter-modal'
            )
    ),
    BlockUserModal: React.lazy(
        () => import(/* webpackChunkName: "block-user-modal" */ 'Components/modal-manager/modals/block-user-modal')
    ),
    BusinessHourModal: React.lazy(
        () =>
            import(/* webpackChunkName: "business-hour-modal" */ 'Components/modal-manager/modals/business-hour-modal')
    ),
    CancelAddPaymentMethodModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "cancel-add-payment-method-modal" */ 'Components/modal-manager/modals/cancel-add-payment-method-modal'
            )
    ),
    CancelEditPaymentMethodModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "cancel-edit-payment-method-modal" */ 'Components/modal-manager/modals/cancel-edit-payment-method-modal'
            )
    ),
    ConfirmDeletePaymentMethodModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "confirm-delete-payment-method-modal" */ 'Components/modal-manager/modals/confirm-delete-payment-method-modal'
            )
    ),
    CopyAdvertModal: React.lazy(
        () => import(/* webpackChunkName: "copy-advert-modal" */ 'Components/modal-manager/modals/copy-advert-modal')
    ),
    CreateAdAddPaymentMethodModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "create-ad-add-payment-method-modal" */ 'Components/modal-manager/modals/create-ad-add-payment-method-modal'
            )
    ),
    CurrencySelectorModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "currency-selector-modal" */ 'Components/modal-manager/modals/currency-selector-modal'
            )
    ),
    DailyLimitModal: React.lazy(
        () => import(/* webpackChunkName: "daily-limit-modal" */ 'Components/modal-manager/modals/daily-limit-modal')
    ),
    DeletePaymentMethodConfirmationModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "delete-payment-method-confirmation-modal" */ 'Components/modal-manager/modals/delete-payment-method-confirmation-modal'
            )
    ),
    DeletePaymentMethodErrorModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "delete-payment-method-error-modal" */ 'Components/modal-manager/modals/delete-payment-method-error-modal'
            )
    ),
    EmailLinkBlockedModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "edit-ad-cancel-modal" */ 'Components/modal-manager/modals/email-link-blocked-modal'
            )
    ),
    EmailLinkExpiredModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "email-link-expired-modal" */ 'Components/modal-manager/modals/email-link-expired-modal'
            )
    ),
    EmailLinkVerifiedModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "email-link-verified-modal" */ 'Components/modal-manager/modals/email-link-verified-modal'
            )
    ),
    EmailVerificationModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "email-verification-modal" */ 'Components/modal-manager/modals/email-verification-modal'
            )
    ),
    ErrorModal: React.lazy(
        () => import(/* webpackChunkName: "error-modal" */ 'Components/modal-manager/modals/error-modal')
    ),
    FilterModal: React.lazy(
        () => import(/* webpackChunkName: "filter-modal" */ 'Components/modal-manager/modals/filter-modal')
    ),
    InvalidVerificationLinkModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "invalid-verification-link-modal" */ 'Components/modal-manager/modals/invalid-verification-link-modal'
            )
    ),
    LeavePageModal: React.lazy(
        () => import(/* webpackChunkName: "leave-page-modal" */ 'Components/modal-manager/modals/leave-page-modal')
    ),
    LoadingModal: React.lazy(
        () => import(/* webpackChunkName: "loading-modal" */ 'Components/modal-manager/modals/loading-modal')
    ),
    MarketRateChangeErrorModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "market-rate-change-error-modal" */ 'Components/modal-manager/modals/market-rate-change-error-modal'
            )
    ),
    MyAdsDeleteModal: React.lazy(
        () =>
            import(/* webpackChunkName: "my-ads-delete-modal" */ 'Components/modal-manager/modals/my-ads-delete-modal')
    ),
    MyAdsDeleteErrorModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "my-ads-delete-error-modal" */ 'Components/modal-manager/modals/my-ads-delete-error-modal'
            )
    ),
    MyAdsFloatingRateSwitchModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "my-ads-floating-rate-switch-modal" */ 'Components/modal-manager/modals/my-ads-floating-rate-switch-modal'
            )
    ),
    MyProfileBalanceModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "my-profile-balance-modal" */ 'Components/modal-manager/modals/my-profile-balance-modal'
            )
    ),
    NicknameModal: React.lazy(
        () => import(/* webpackChunkName: "nickname-modal" */ 'Components/modal-manager/modals/nickname-modal')
    ),
    OrderDetailsCancelModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "order-details-cancel-modal" */ 'Components/modal-manager/modals/order-details-cancel-modal'
            )
    ),
    OrderDetailsConfirmModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "order-details-confirm-modal" */ 'Components/modal-manager/modals/order-details-confirm-modal'
            )
    ),
    OrderTimeTooltipModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "order-time-tooltip-modal" */ 'Components/modal-manager/modals/order-time-tooltip-modal'
            )
    ),
    PreferredCountriesModal: React.lazy(
        () =>
            import(
                /* webpackChunkName: "preferred-countries-modal" */ 'Components/modal-manager/modals/preferred-countries-modal'
            )
    ),
    QuickAddModal: React.lazy(
        () => import(/* webpackChunkName: "quick-add-modal" */ 'Components/modal-manager/modals/quick-add-modal')
    ),
    RatingModal: React.lazy(
        () => import(/* webpackChunkName: "rating-modal" */ 'Components/modal-manager/modals/rating-modal')
    ),
    RecommendedModal: React.lazy(
        () => import(/* webpackChunkName: "recommended-modal" */ 'Components/modal-manager/modals/recommended-modal')
    ),
    ShareMyAdsModal: React.lazy(
        () => import(/* webpackChunkName: "share-my-ads-modal" */ 'Components/modal-manager/modals/share-my-ads-modal')
    ),
} as const;

export type TModals = typeof Modals;
export type TModalKeys = keyof TModals;
export type TModalProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [T in TModalKeys]: Parameters<TModals[T]>[0] extends { [key: string]: any }
        ? Parameters<TModals[T]>[0]
        : Record<string, never>;
};
