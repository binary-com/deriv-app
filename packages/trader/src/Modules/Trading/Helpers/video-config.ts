type TDtraderVideoUrl = {
    [key: string]: TVideoVariants;
};

type TVideoVariants = {
    dark: string;
    light: string;
};

/* The video upload feature is not available yet. The following video ids are taken from CF Stream account.
If considered necessary later, the current approach can be replaced with HTTP-request to fetch videos by their file names. */
export const DESCRIPTION_VIDEO_ID: TDtraderVideoUrl = {
    accumulator: {
        light: 'c1d64d5ffaf449e3326d387a70621a4c',
        dark: '9657e4adcfd9274d41a042b7b6c42d60',
    },
    even_odd: {
        light: 'a3930b0a535c4f23daea5cf98a718941',
        dark: 'e311e25dd68761d6ab73e8158ec83ea4',
    },
    high_low: {
        light: 'f528c662c377601908a741ae2aedaec6',
        dark: '4c05445e1bd28f3f9f95b0ab566c4f9b',
    },
    match_diff: {
        light: '8693a02397d284ffcf0608e4fda702d9',

        dark: '2e56ad7ea67bf3f9a869de6336df1796',
    },
    multiplier: {
        light: 'bca032791da88023e81ebf7341226f83',
        dark: '3d10e25e2e0eaaf96d1874aae257029f',
    },
    over_under: {
        light: '9e2be907cba9b38352890e52cfd8cbaf',

        dark: '4b31fc188c2f365faa310f7e34715af7',
    },
    rise_fall: {
        light: '7719c7e5436f58e59ab47510445108ba',
        dark: 'b72ef7ec914afe3dbb2a1601cad3a76f',
    },
    touch: {
        light: 'c781a6844f37a3308fe8774b4450dfc9',
        dark: 'c91f2b9859dc95ce8eecf7df327aaf00',
    },
    vanilla: {
        light: '9b8b6ae67d3a720e4aee2665889d17fb',
        dark: '8f04e9d768b8e08a1d87830c95c6b9c8',
    },
};

export const getDescriptionVideoId = (contract_type = '', is_dark_theme = false) =>
    DESCRIPTION_VIDEO_ID[contract_type]?.[is_dark_theme ? 'dark' : 'light'];
