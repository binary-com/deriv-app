import UAParser from 'ua-parser-js';

declare global {
    interface Window {
        opera?: string;
        MSStream?: {
            readonly type: string;
            msClose: () => void;
            msDetachStream: () => void;
        };
    }
    interface Navigator {
        userAgentData?: NavigatorUAData;
    }
}

type NavigatorUAData = {
    brands: Array<{ brand: string; version: string }>;
    mobile: boolean;
    getHighEntropyValues(hints: string[]): Promise<HighEntropyValues>;
};

type HighEntropyValues = {
    platform?: string;
    platformVersion?: string;
    model?: string;
    uaFullVersion?: string;
};

export const systems = {
    mac: ['Mac68K', 'MacIntel', 'MacPPC'],
    linux: [
        'HP-UX',
        'Linux i686',
        'Linux amd64',
        'Linux i686 on x86_64',
        'Linux i686 X11',
        'Linux x86_64',
        'Linux x86_64 X11',
        'FreeBSD',
        'FreeBSD i386',
        'FreeBSD amd64',
        'X11',
    ],
    ios: ['iPhone', 'iPod', 'iPad', 'iPhone Simulator', 'iPod Simulator', 'iPad Simulator'],
    android: [
        'Android',
        'Linux armv7l', // Samsung galaxy s2 ~ s5, nexus 4/5
        'Linux armv8l',
        null,
    ],
    windows: ['Win16', 'Win32', 'Win64', 'WinCE'],
};

export const isDesktopOs = () => {
    const os = OSDetect();
    return !!['windows', 'mac', 'linux'].find(system => system === os);
};

export const isMobileOs = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const OSDetect = () => {
    // For testing purposes or more compatibility, if we set 'config.os'
    // inside our localStorage, we ignore fetching information from
    // navigator object and return what we have straight away.
    if (localStorage.getItem('config.os')) {
        return localStorage.getItem('config.os');
    }
    if (typeof navigator !== 'undefined' && navigator.platform) {
        return Object.keys(systems)
            .map(os => {
                if (systems[os as keyof typeof systems].some(platform => navigator.platform === platform)) {
                    return os;
                }
                return false;
            })
            .filter(os => os)[0];
    }

    return 'Unknown OS';
};

export const mobileOSDetect = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
    // huawei devices regex from: https://gist.github.com/megaacheyounes/e1c7eec5c790e577db602381b8c50bfa
    const huaweiDevicesRegex =
        /\bK\b|ALP-|AMN-|ANA-|ANE-|ANG-|AQM-|ARS-|ART-|ATU-|BAC-|BLA-|BRQ-|CAG-|CAM-|CAN-|CAZ-|CDL-|CDY-|CLT-|CRO-|CUN-|DIG-|DRA-|DUA-|DUB-|DVC-|ELE-|ELS-|EML-|EVA-|EVR-|FIG-|FLA-|FRL-|GLK-|HMA-|HW-|HWI-|INE-|JAT-|JEF-|JER-|JKM-|JNY-|JSC-|LDN-|LIO-|LON-|LUA-|LYA-|LYO-|MAR-|MED-|MHA-|MLA-|MRD-|MYA-|NCE-|NEO-|NOH-|NOP-|OCE-|PAR-|PIC-|POT-|PPA-|PRA-|RNE-|SEA-|SLA-|SNE-|SPN-|STK-|TAH-|TAS-|TET-|TRT-|VCE-|VIE-|VKY-|VNS-|VOG-|VTR-|WAS-|WKG-|WLZ-|JAD-|WKG-|MLD-|RTE-|NAM-|NEN-|BAL-|JAD-|JLN-|YAL/i;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return 'Windows Phone';
    }

    if (/android/i.test(userAgent)) {
        // Huawei UA is the same as android so we have to detect by the model
        if (huaweiDevicesRegex.test(userAgent) || /huawei/i.test(userAgent)) {
            return 'huawei';
        }
        return 'Android';
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'iOS';
    }

    return 'unknown';
};

// Simple regular expression to match potential Huawei device codes
const huaweiDevicesRegex = /\b([A-Z]{3}-)\b/gi;

// Set of valid Huawei device codes
const validCodes = new Set([
    'ALP-',
    'AMN-',
    'ANA-',
    'ANE-',
    'ANG-',
    'AQM-',
    'ARS-',
    'ART-',
    'ATU-',
    'BAC-',
    'BLA-',
    'BRQ-',
    'CAG-',
    'CAM-',
    'CAN-',
    'CAZ-',
    'CDL-',
    'CDY-',
    'CLT-',
    'CRO-',
    'CUN-',
    'DIG-',
    'DRA-',
    'DUA-',
    'DUB-',
    'DVC-',
    'ELE-',
    'ELS-',
    'EML-',
    'EVA-',
    'EVR-',
    'FIG-',
    'FLA-',
    'FRL-',
    'GLK-',
    'HMA-',
    'HW-',
    'HWI-',
    'INE-',
    'JAT-',
    'JEF-',
    'JER-',
    'JKM-',
    'JNY-',
    'JSC-',
    'LDN-',
    'LIO-',
    'LON-',
    'LUA-',
    'LYA-',
    'LYO-',
    'MAR-',
    'MED-',
    'MHA-',
    'MLA-',
    'MRD-',
    'MYA-',
    'NCE-',
    'NEO-',
    'NOH-',
    'NOP-',
    'OCE-',
    'PAR-',
    'PIC-',
    'POT-',
    'PPA-',
    'PRA-',
    'RNE-',
    'SEA-',
    'SLA-',
    'SNE-',
    'SPN-',
    'STK-',
    'TAH-',
    'TAS-',
    'TET-',
    'TRT-',
    'VCE-',
    'VIE-',
    'VKY-',
    'VNS-',
    'VOG-',
    'VTR-',
    'WAS-',
    'WKG-',
    'WLZ-',
    'JAD-',
    'MLD-',
    'RTE-',
    'NAM-',
    'NEN-',
    'BAL-',
    'JLN-',
    'YAL-',
    'MGA-',
    'FGD-',
    'XYAO-',
    'BON-',
    'ALN-',
    'ALT-',
    'BRA-',
    'DBY2-',
    'STG-',
    'MAO-',
    'LEM-',
    'GOA-',
    'FOA-',
    'MNA-',
    'LNA-',
]);

// Function to validate Huawei device codes from a string
function validateHuaweiCodes(inputString: string) {
    const matches = inputString.match(huaweiDevicesRegex);
    if (matches) {
        return matches.filter(code => validCodes.has(code.toUpperCase())).length > 0;
    }
    return false;
}

export const mobileOSDetectAsync = async () => {
    const userAgent = navigator.userAgent ?? window.opera ?? '';
    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return 'Windows Phone';
    }

    if (/android/i.test(userAgent)) {
        // Check if navigator.userAgentData is available for modern browsers
        if (navigator?.userAgentData) {
            const ua = await navigator.userAgentData.getHighEntropyValues(['model']);
            if (validateHuaweiCodes(ua?.model || '')) {
                return 'huawei';
            }
        } else if (validateHuaweiCodes(userAgent) || /huawei/i.test(userAgent)) {
            return 'huawei';
        }
        return 'Android';
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'iOS';
    }

    return 'unknown';
};

export const getOSNameWithUAParser = () => UAParser().os.name;
