import config_data from '../../../brand.config.json';

export const getBrandName = () => {
    return config_data.brand_name;
}

export const getBusinessEntityName = () => {
    return 'Peeps Investments (Europe) Limited';
}

export const getLandingPageDomainName = () => {
    return config_data.domain_name;
}

export const getPlatformSettings = (platform_key) => {
    return config_data.platforms[platform_key];
}
