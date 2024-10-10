export const Jurisdiction = Object.freeze({
    SVG: 'svg',
    BVI: 'bvi',
    VANUATU: 'vanuatu',
    LABUAN: 'labuan',
    MALTA_INVEST: 'maltainvest',
});

export const Platforms = Object.freeze({
    DXTRADE: 'dxtrade',
    MT5: 'mt5',
});

export const DBVI_COMPANY_NAMES = {
    bvi: {
        name: 'Deriv (BVI) Ltd',
        tnc_url: 'tnc/deriv-(bvi)-ltd.pdf',
    },
    maltainvest: {
        name: 'Deriv Investments (Europe) Limited',
        tnc_url: 'tnc/deriv-investments-(europe)-limited.pdf',
    },
    vanuatu: {
        name: 'Deriv (V) Ltd',
        tnc_url: 'tnc/general-terms.pdf',
    },
    svg: { name: 'Deriv (SVG) LLC', tnc_url: '' },
} as const;

export const JURISDICTION_MARKET_TYPES = {
    FINANCIAL: 'financial',
    DERIVED: 'synthetic',
} as const;
