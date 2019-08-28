import React        from 'react';
import { localize } from 'App/i18n';
import {
    IconDeriv,
    IconReports }   from 'deriv-components'; // don't lazy load header icons
import { routes }   from 'Constants/index';

const header_links = [
    {
        id     : 'dt_deriv_logo',
        logo   : <div className='header__logo'>{localize('BETA')}</div>,
        image  : <IconDeriv className='header__icon' customColors={{ '&fill': 'color3-fill' }} />,
        link_to: routes.trade,
    },
    {
        id        : 'dt_reports_tab',
        icon      : <IconReports className='header__icon' />,
        text      : localize('Reports'),
        link_to   : routes.reports,
        login_only: true,
    },
];

export default header_links;
