import React from 'react';

export const modals = {
    MyAdsDeleteModal: React.lazy(() =>
        import(/* webpackChunkName: "my-ads-delete-modal" */ 'Components/modal-manager/modals/my-ads-delete-modal')
    ),
    MyAdsDeleteErrorModal: React.lazy(() =>
        import(
            /* webpackChunkName: "my-ads-delete-error-modal" */ 'Components/modal-manager/modals/my-ads-delete-error-modal'
        )
    ),
    MyAdsFloatingRateSwitchModal: React.lazy(() =>
        import(
            /* webpackChunkName: "my-ads-floating-rate-switch-modal" */ 'Components/modal-manager/modals/my-ads-floating-rate-switch-modal'
        )
    ),
};
