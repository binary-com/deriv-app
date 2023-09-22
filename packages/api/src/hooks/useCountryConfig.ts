import { useCallback, useMemo } from 'react';
import useFetch from '../useFetch';

type TCountryCode = Uppercase<
    | 'af'
    | 'ax'
    | 'al'
    | 'dz'
    | 'as'
    | 'ad'
    | 'ao'
    | 'ai'
    | 'aq'
    | 'ag'
    | 'ar'
    | 'am'
    | 'aw'
    | 'au'
    | 'at'
    | 'az'
    | 'bs'
    | 'bh'
    | 'bd'
    | 'bb'
    | 'by'
    | 'be'
    | 'bz'
    | 'bj'
    | 'bm'
    | 'bt'
    | 'bo'
    | 'ba'
    | 'bw'
    | 'bv'
    | 'br'
    | 'io'
    | 'vg'
    | 'bn'
    | 'bg'
    | 'bf'
    | 'bi'
    | 'kh'
    | 'cm'
    | 'ca'
    | 'cv'
    | 'bq'
    | 'ky'
    | 'cf'
    | 'td'
    | 'cl'
    | 'cn'
    | 'cx'
    | 'cc'
    | 'co'
    | 'km'
    | 'cg'
    | 'cd'
    | 'ck'
    | 'cr'
    | 'ci'
    | 'hr'
    | 'cu'
    | 'cw'
    | 'cy'
    | 'cz'
    | 'dk'
    | 'dj'
    | 'dm'
    | 'do'
    | 'ec'
    | 'eg'
    | 'sv'
    | 'gq'
    | 'er'
    | 'ee'
    | 'et'
    | 'fk'
    | 'fo'
    | 'fj'
    | 'fi'
    | 'fr'
    | 'gf'
    | 'pf'
    | 'tf'
    | 'ga'
    | 'gm'
    | 'ge'
    | 'de'
    | 'gh'
    | 'gi'
    | 'gr'
    | 'gl'
    | 'gd'
    | 'gp'
    | 'gu'
    | 'gt'
    | 'gg'
    | 'gn'
    | 'gw'
    | 'gy'
    | 'ht'
    | 'hm'
    | 'hn'
    | 'hk'
    | 'hu'
    | 'is'
    | 'in'
    | 'id'
    | 'ir'
    | 'iq'
    | 'ie'
    | 'im'
    | 'il'
    | 'it'
    | 'jm'
    | 'jp'
    | 'je'
    | 'jo'
    | 'kz'
    | 'ke'
    | 'ki'
    | 'kw'
    | 'kg'
    | 'la'
    | 'lv'
    | 'lb'
    | 'ls'
    | 'lr'
    | 'ly'
    | 'li'
    | 'lt'
    | 'lu'
    | 'mo'
    | 'mk'
    | 'mg'
    | 'mw'
    | 'my'
    | 'mv'
    | 'ml'
    | 'mt'
    | 'mh'
    | 'mq'
    | 'mr'
    | 'mu'
    | 'yt'
    | 'mx'
    | 'fm'
    | 'md'
    | 'mc'
    | 'mn'
    | 'me'
    | 'ms'
    | 'ma'
    | 'mz'
    | 'mm'
    | 'na'
    | 'nr'
    | 'np'
    | 'nl'
    | 'nc'
    | 'nz'
    | 'ni'
    | 'ne'
    | 'ng'
    | 'nu'
    | 'nf'
    | 'kp'
    | 'mp'
    | 'no'
    | 'om'
    | 'pk'
    | 'pw'
    | 'ps'
    | 'pa'
    | 'pg'
    | 'py'
    | 'pe'
    | 'ph'
    | 'pn'
    | 'pl'
    | 'pt'
    | 'pr'
    | 'qa'
    | 're'
    | 'ro'
    | 'ru'
    | 'rw'
    | 'bl'
    | 'sh'
    | 'kn'
    | 'lc'
    | 'mf'
    | 'pm'
    | 'ws'
    | 'sm'
    | 'st'
    | 'sa'
    | 'sn'
    | 'rs'
    | 'sc'
    | 'sl'
    | 'sg'
    | 'sx'
    | 'sk'
    | 'si'
    | 'sb'
    | 'so'
    | 'za'
    | 'gs'
    | 'kr'
    | 'ss'
    | 'es'
    | 'lk'
    | 'vc'
    | 'sd'
    | 'sr'
    | 'sj'
    | 'sz'
    | 'se'
    | 'ch'
    | 'sy'
    | 'tw'
    | 'tj'
    | 'tz'
    | 'th'
    | 'tl'
    | 'tg'
    | 'tk'
    | 'to'
    | 'tt'
    | 'tn'
    | 'tr'
    | 'tm'
    | 'tc'
    | 'tv'
    | 'um'
    | 'vi'
    | 'ug'
    | 'ua'
    | 'ae'
    | 'gb'
    | 'us'
    | 'uy'
    | 'uz'
    | 'vu'
    | 'va'
    | 've'
    | 'vn'
    | 'wf'
    | 'eh'
    | 'ye'
    | 'zm'
    | 'zw'
>;

/** A custom hook to get the country config information from `residence_list` endpoint. */
const useCountryConfig = () => {
    const { data: residence_list_data, ...rest } = useFetch('residence_list');

    // Add additional information to the country config.
    const modified_residence_list = useMemo(
        () =>
            residence_list_data?.residence_list?.map(country_config => {
                return {
                    ...country_config,
                    /** Determine if the country is disabled */
                    is_disabled: country_config.disabled !== undefined,
                    /** 2-letter country code */
                    code: `${country_config.value}`.toUpperCase(),
                    /** Country name */
                    name: `${country_config.text}`,
                    /** Determine if the IDV service is supported for the country */
                    is_idv_supported: country_config.identity?.services?.idv?.is_country_supported === 1,
                    /** Determine if the Onfido service is supported for the country */
                    is_onfido_supported: country_config.identity?.services?.onfido?.is_country_supported === 1,
                };
            }),
        [residence_list_data?.residence_list]
    );

    // Transform the country config array into a record object.
    const transformed_residence_list = useMemo(() => {
        return modified_residence_list?.reduce<Record<string, typeof modified_residence_list[number]>>(
            (previous, current) => ({ ...previous, [current.code]: current }),
            {}
        );
    }, [modified_residence_list]);

    const getConfig = useCallback(
        (currency: TCountryCode | Omit<string, TCountryCode>) => transformed_residence_list?.[currency as string],
        [transformed_residence_list]
    );

    return {
        /** Available countries and their information */
        data: transformed_residence_list,
        /** Returns the country config object for the given country code */
        getConfig,
        ...rest,
    };
};

export default useCountryConfig;
