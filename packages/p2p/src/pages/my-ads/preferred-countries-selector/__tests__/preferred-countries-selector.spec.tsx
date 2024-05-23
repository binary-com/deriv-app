import React from 'react';
import { Formik } from 'formik';
import { render, screen } from '@testing-library/react';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import PreferredCountriesSelector from '../preferred-countries-selector';

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    showModal: jest.fn(),
};
jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));
const country_list = {
    ad: {
        country_name: 'Andorra',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'EUR',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    af: {
        country_name: 'Afghanistan',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'AFN',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    ai: {
        country_name: 'Anguilla',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'XCD',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
};

describe('<PreferredCountriesSelector/>', () => {
    it('should render the component', () => {
        render(
            <Formik initialValues={{ eligible_countries: Object.keys(country_list) }} onSubmit={jest.fn()}>
                <PreferredCountriesSelector country_list={country_list} />
            </Formik>
        );

        const selector = screen.getByRole('textbox');
        expect(selector).toHaveValue('');
    });
    it('should render the eligible countries', () => {
        render(
            <Formik initialValues={{ eligible_countries: ['ad', 'af'] }} onSubmit={jest.fn()}>
                <PreferredCountriesSelector country_list={country_list} />
            </Formik>
        );

        const selector = screen.getByRole('textbox');
        expect(selector).toHaveValue('Andorra, Afghanistan');
    });
});
