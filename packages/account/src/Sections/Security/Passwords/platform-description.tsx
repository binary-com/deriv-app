import { Localize } from '@deriv-com/translations';

type TPlatformDescription = {
    brand_website_name: string;
    platform_values: {
        platform_name_trader: string;
        platform_name_dbot: string;
        platform_name_smarttrader: string;
        platform_name_go: string;
        platform_name_ctrader: string;
    };
    is_eu_user: boolean;
    financial_restricted_countries: boolean;
};

/**
 * Renders description for the platforms.
 * @name PlatformDescription
 * @param brand_website_name -  Name of the website
 * @param platform_values - Object containing platform names
 * @param is_eu_user - Boolean value to check if user is from EU
 * @param financial_restricted_countries - Boolean value to check if user is from a restricted country
 * @returns Returns a react node
 */
const PlatformDescription = ({
    brand_website_name,
    platform_values,
    is_eu_user,
    financial_restricted_countries,
}: TPlatformDescription) => {
    const {
        platform_name_trader,
        platform_name_dbot,
        platform_name_smarttrader,
        platform_name_go,
        platform_name_ctrader,
    } = platform_values;
    if (is_eu_user) {
        return (
            <Localize
                i18n_default_text={
                    'Use your <0>Deriv password</0> to log in to {{brand_website_name}} and {{platform_name_trader}}.'
                }
                components={[<strong key={0} />]}
                values={{
                    brand_website_name,
                    platform_name_trader,
                }}
            />
        );
    } else if (financial_restricted_countries) {
        return (
            <Localize
                i18n_default_text={
                    'Use your <0>Deriv password</0> to log in to {{brand_website_name}}, {{platform_name_trader}} and {{platform_name_go}}.'
                }
                components={[<strong key={0} />]}
                values={{
                    brand_website_name,
                    platform_name_trader,
                    platform_name_go,
                }}
            />
        );
    }
    return (
        <Localize
            i18n_default_text={
                'Use your <0>Deriv password</0> to log in to {{brand_website_name}}, {{platform_name_go}}, {{platform_name_trader}}, {{platform_name_smarttrader}}, {{platform_name_dbot}} and {{platform_name_ctrader}}.'
            }
            components={[<strong key={0} />]}
            values={{
                brand_website_name,
                platform_name_trader,
                platform_name_dbot,
                platform_name_smarttrader,
                platform_name_go,
                platform_name_ctrader,
            }}
        />
    );
};

export default PlatformDescription;
