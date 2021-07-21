export const default_delay = 3000;

export const max_display_notifications = 3;
export const max_display_notifications_mobile = 1;

export const icon_types = {
    danger: 'IcAlertDanger',
    info: 'IcAlertInfo',
    success: 'IcAlertSuccess',
    warning: 'IcAlertWarning',
    contract_sold: 'IcAlertInfo',
    announce: 'IcAlertAnnounce',
};

export const types = {
    announce: 'notification--announce',
    danger: 'notification--danger',
    info: 'notification--info',
    success: 'notification--success',
    warning: 'notification--warning',
    contract_sold: 'notification--info',
};

export const sortNotifications = (() => {
    const notification_order = {
        news: 1,
        contract_sold: 2,
        danger: 3,
        warning: 4,
        info: 5,
        success: 6,
    };

    const notification_order_variant = {
        account: 1,
        system: 2,
    };

    return (a, b) =>
        notification_order_variant[a.variant] - notification_order_variant[b.variant] ||
        notification_order[a.type] - notification_order[b.type];
})();

export const sortNotificationsMobile = (() => {
    const notification_order_mobile = {
        contract_sold: 1,
        danger: 2,
        news: 3,
        warning: 4,
        info: 5,
        success: 6,
    };

    const notification_order_mobile_variant = {
        account: 1,
        system: 2,
    };

    return (a, b) =>
        notification_order_mobile_variant[a.variant] - notification_order_mobile_variant[b.variant] ||
        notification_order_mobile[a.type] - notification_order_mobile[b.type];
})();
