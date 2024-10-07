/* eslint-disable camelcase */
import React, { ComponentProps } from 'react';
import * as Formik from 'formik';
import { APIProvider } from '@deriv/api-v2';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletsAuthProvider from '../../../../../../../AuthProvider';
import { TransferProvider } from '../../../provider';
import { TAccount, TInitialTransferFormValues } from '../../../types';
import TransferFormAmountInput from '../TransferFormAmountInput';

const RATES = {
    BTC: {
        ETH: 20,
        LTC: 690,
        USD: 69000,
    },
    ETH: {
        BTC: 0.05,
        LTC: 35,
        USD: 3450,
    },
    LTC: {
        BTC: 0.0015,
        ETH: 0.03,
        USD: 100,
    },
    USD: {
        BTC: 0.000015,
        ETH: 0.0003,
        LTC: 0.01,
    },
};

const ACCOUNTS: NonNullable<TAccount>[] = [
    {
        account_category: 'wallet',
        account_type: 'doughflow',
        balance: '1000',
        currency: 'USD',
        currencyConfig: {
            fractional_digits: 2,
        },
    },
    {
        account_category: 'wallet',
        account_type: 'crypto',
        balance: '0.1',
        currency: 'BTC',
        currencyConfig: {
            fractional_digits: 8,
        },
    },
    {
        account_category: 'wallet',
        account_type: 'crypto',
        balance: '1',
        currency: 'ETH',
        currencyConfig: {
            fractional_digits: 8,
        },
    },
    {
        account_category: 'wallet',
        account_type: 'crypto',
        balance: '1',
        currency: 'LTC',
        currencyConfig: {
            fractional_digits: 8,
        },
    },
] as NonNullable<TAccount>[];

const mockRefetchExchangeRates = jest.fn(() =>
    Promise.resolve({
        data: {
            base_currency: 'USD',
            exchange_rates: {
                rates: RATES,
            },
        },
    })
);

const mockRefetchAccountLimits = jest.fn();

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useGetExchangeRate: jest.fn(({ base_currency }: { base_currency: string }) => ({
        data: {
            base_currency,
            rates: RATES[base_currency as keyof typeof RATES],
        },
    })),
    useTransferBetweenAccounts: jest.fn(() => ({
        data: { accounts: ACCOUNTS },
    })),
}));

jest.mock('usehooks-ts', () => ({
    ...jest.requireActual('usehooks-ts'),
    useCountdown: jest.fn(() => {
        const count = 0;
        const resetCountdown = jest.fn();
        const startCountdown = jest.fn();
        return [count, { resetCountdown, startCountdown }];
    }),
}));

jest.mock('../../../provider', () => ({
    ...jest.requireActual('../../../provider'),
    useTransfer: jest.fn(() => ({
        ...jest.requireActual('../../../provider').useTransfer(),
        refetchAccountLimits: mockRefetchAccountLimits,
        refetchExchangeRates: mockRefetchExchangeRates,
    })),
}));

const renderField = (
    type: ComponentProps<typeof TransferFormAmountInput>['fieldName'],
    currency: string,
    optionalConfig?: Record<string, unknown>
) => {
    const FORM_VALUES: TInitialTransferFormValues = {
        activeAmountFieldName: type,
        fromAccount: undefined,
        fromAmount: 0,
        toAccount: undefined,
        toAmount: 0,
        [type.replace('Amount', 'Account')]: ACCOUNTS.find(acc => acc.currency === currency),
        ...optionalConfig,
    };

    render(
        <APIProvider>
            <WalletsAuthProvider>
                <TransferProvider accounts={ACCOUNTS}>
                    {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
                    <Formik.Formik initialValues={FORM_VALUES} onSubmit={() => {}}>
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <TransferFormAmountInput fieldName={type} />
                            </form>
                        )}
                    </Formik.Formik>
                </TransferProvider>
            </WalletsAuthProvider>
        </APIProvider>
    );
};

const getField = () => screen.getByDisplayValue(/^\d+\.\d+$/u);

describe('TransferFormAmountInput', () => {
    it('renders 2 inputs in case of fiat currency', () => {
        renderField('fromAmount', 'USD');

        const fields = screen.getAllByRole('textbox');
        expect(fields).toHaveLength(2);
    });

    it('renders 2 inputs in case of crypto currency', () => {
        renderField('toAmount', 'BTC');

        const fields = screen.getAllByRole('textbox');
        expect(fields).toHaveLength(2);
    });

    it('has 2 decimal places in case of USD', () => {
        renderField('fromAmount', 'USD');

        const field = getField();
        expect(field).toHaveValue('0.00');
    });

    it('has 8 decimal places in case of BTC', () => {
        renderField('fromAmount', 'BTC');

        const field = getField();
        expect(field).toHaveValue('0.00000000');
    });

    it('has 8 max digits restriction in case of USD', async () => {
        renderField('fromAmount', 'USD');

        const field = getField();
        await userEvent.type(field, '9999999999999999999999999999');
        expect(field).toHaveValue('999,999.99');
    });

    it('has 9 max digits restriction in case of BTC', async () => {
        renderField('fromAmount', 'BTC');

        const field = getField();
        await userEvent.type(field, '9999999999999999999999999999');
        expect(field).toHaveValue('9.99999999');
    });

    it('should not react to pasting when exceeding max value in case of USD', async () => {
        renderField('fromAmount', 'USD');

        const field = getField();
        const pastedVal = '9999999';
        await userEvent.paste(field, pastedVal, {
            clipboardData: {
                getData: (format: string) => (format === 'Text' ? pastedVal : ''),
            } as DataTransfer,
        });
        expect(field).toHaveValue('0.00');
    });

    it('should not react to pasting when exceeding max value in case of BTC', async () => {
        renderField('fromAmount', 'BTC');

        const field = getField();
        const pastedVal = '9999999999';
        await userEvent.paste(field, pastedVal, {
            clipboardData: {
                getData: (format: string) => (format === 'Text' ? pastedVal : ''),
            } as DataTransfer,
        });
        expect(field).toHaveValue('0.00000000');
    });

    it('should paste an integer value as an integer in case of fiat (USD)', async () => {
        renderField('fromAmount', 'USD');

        const field = getField();
        const pastedVal = '123';
        await userEvent.paste(field, pastedVal, {
            clipboardData: {
                getData: (format: string) => (format === 'Text' ? pastedVal : ''),
            } as DataTransfer,
        });
        expect(field).toHaveValue('123.00');
    });

    it('should paste an integer value as a fraction in case of crypto (BTC)', async () => {
        renderField('fromAmount', 'BTC');

        const field = getField();
        const pastedVal = '123';
        await userEvent.paste(field, pastedVal, {
            clipboardData: {
                getData: (format: string) => (format === 'Text' ? pastedVal : ''),
            } as DataTransfer,
        });
        await userEvent.tab();
        expect(field).toHaveValue('0.00000123');
    });

    it('refetches exchangeRatesAndLimits when the countdown is complete', async () => {
        const config = {
            fromAccount: ACCOUNTS[1], // BTC account
            fromAmount: 100,
            toAmount: 0.00000001,
        };

        await act(async () => {
            renderField('toAmount', 'USD', config);
        });
        expect(mockRefetchAccountLimits).toHaveBeenCalled();
        expect(mockRefetchExchangeRates).toHaveBeenCalled();
    });

    it('renders the component when the currency of the fromAccount is not provided', () => {
        const config = {
            fromAmount: 100,
            toAmount: 0.00000001,
        };
        renderField('toAmount', 'USD', config);
        expect(screen.getByText('Estimated amount')).toBeInTheDocument();
    });

    it('calls setValues with the same amount for the fromAmount and toAmount when the currency is the same for both accounts', () => {
        const mockSetValues = jest.fn((callback: unknown) => {
            if (typeof callback === 'function') {
                return callback();
            }
        });
        const useFormikContextSpy = jest.spyOn(Formik, 'useFormikContext');
        (useFormikContextSpy as jest.Mock).mockImplementation(() => ({
            errors: {},
            isSubmitting: false,
            isValidating: false,
            setValues: mockSetValues,
            submitCount: 0,
            touched: {},
            values: {
                activeAmountFieldName: 'fromAmount',
                fromAmount: 1.1,
                toAmount: 0.00000001,
            },
        }));
        const config = {
            toAccount: ACCOUNTS[0], // USD account
        };
        renderField('fromAmount', 'USD', config);
        expect(mockSetValues).toHaveBeenCalled();
        expect(mockSetValues.mock.calls[0][0]).toBeInstanceOf(Function);
        const { fromAmount: returnedFromAmount, toAmount: returnedToAmount } = mockSetValues.mock.results[1].value;
        expect(returnedFromAmount).toEqual(1.1);
        expect(returnedToAmount).toEqual(1.1);
    });

    it('sets the toAmount when isFromAmountField is true', async () => {
        const toAccount = ACCOUNTS[1]; // BTC account
        const mockSetFieldValue = jest.fn();
        const useFormikContextSpy = jest.spyOn(Formik, 'useFormikContext');
        (useFormikContextSpy as jest.Mock).mockImplementationOnce(() => ({
            errors: {},
            isSubmitting: false,
            isValidating: false,
            setFieldValue: mockSetFieldValue,
            setValues: jest.fn(),
            submitCount: 0,
            touched: {},
            values: {
                activeAmountFieldName: 'fromAmount',
                fromAccount: ACCOUNTS[0], // USD account
                fromAmount: 1000,
                toAccount,
                toAmount: 0.1,
            },
        }));
        const config = {
            fromAmount: 1000,
            toAccount,
        };
        await act(async () => {
            renderField('fromAmount', 'USD', config);
        });

        expect(mockSetFieldValue).toHaveBeenCalledWith('toAmount', 0.015);
    });
});
