// eslint-disable @typescript-eslint/no-explicit-any
declare const SmileIdentity: any;
export const useSmileId = () => {
    const getWebToken = async (product: string) => {
        const baseAPIURL = 'http://localhost:3000';
        const fetchConfig: RequestInit = {};

        fetchConfig.cache = 'no-cache';
        fetchConfig.mode = 'cors';
        fetchConfig.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        fetchConfig.body = JSON.stringify({
            partner_id: '1091',
            product,
        });
        fetchConfig.method = 'POST';

        const URL = `${baseAPIURL}/token/`;
        try {
            const response = await fetch(URL, fetchConfig);

            if (response.status === 201) {
                const json = await response.json();

                if (json.error) {
                    throw new Error(json.error);
                }

                return json;
            }
        } catch (e) {
            const error = e as Error;
            alert(`API: ${error.name}, ${error.message}`);
            throw error;
        }
    };

    const configureSmileIdentityWebIntegration = (token: string, product: string) => {
        const callback_url = `${process.env.SID_CALLBACK_URL}`;
        const partner_id = `${process.env.SID_PARTNER_ID}`;
        SmileIdentity({
            token,
            product,
            callback_url,
            environment: 'sandbox',
            use_new_component: true,
            partner_details: {
                partner_id,
                name: `Deriv`,
                logo_url: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTAFsSsUijWsY8OPOc9i2muyKdgVkUGDuDKw&s`,
                policy_url: `https://deriv.com/terms-and-conditions#clients`,
                theme_color: '#f94450',
            },
            // id_selection: {
            //     AO: ['DRIVERS_LICENSE'],
            // },


            onSuccess: () => {
                alert('SmileIdentityWebIntegration: onSuccess');
            },
            onClose: () => {
                alert('SmileIdentityWebIntegration: onClose');
            },
            onError: () => {
                alert('SmileIdentityWebIntegration: onError');
            },
        });
    };

    const initSmileIdentity = async ({ product }: { product: string }) => {
        const response = await getWebToken(product);
        configureSmileIdentityWebIntegration(response.token, product);
    };

    return { initSmileIdentity };
};
