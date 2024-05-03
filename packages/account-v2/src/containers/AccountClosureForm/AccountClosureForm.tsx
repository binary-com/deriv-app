import React, { Fragment, useEffect, useReducer, useRef } from 'react';
import { Field, Form, Formik, FormikProps } from 'formik';
import { useCloseDerivAccount } from '@deriv/api-v2';
import { Button, Checkbox, Text, TextArea } from '@deriv-com/ui';
import { TAccountClosureError } from 'src/types';
import {
    accountClosureReasons,
    CHARACTER_LIMIT_FOR_CLOSING_ACCOUNT,
    MAX_ALLOWED_REASONS_FOR_CLOSING_ACCOUNT,
    TAccountClosureFormActions,
} from '../../constants';
import {
    getAccountClosureReasons,
    getAccountClosureValidationSchema,
    TAccountClosureReasonsFormValues,
    validateAccountClosure,
} from '../../utils';
import { AccountClosureConfirmModal } from './AccountClosureConfirmModal';
import { AccountClosureSuccessModal } from './AccountClosureSuccessModal';
import { AccountClosureWarningModal } from './AccountClosureWarningModal';

export const AccountClosureForm = ({ handleOnBack }: { handleOnBack: () => void }) => {
    const { error, isError, isSuccess, mutate } = useCloseDerivAccount();

    useEffect(() => {
        if (isError) {
            dispatch({ payload: isError, type: 'displayWarningModal' });
        }
        if (isSuccess) {
            dispatch({ payload: isSuccess, type: 'displaySuccessModal' });
        }
    }, [isError, isSuccess]);

    const reasons = accountClosureReasons();
    const validationSchema = getAccountClosureValidationSchema();

    const formRef = useRef<FormikProps<TAccountClosureReasonsFormValues>>(null);

    const isReasonNotSelected = !validateAccountClosure(
        formRef.current?.values as TAccountClosureReasonsFormValues,
        formRef.current?.dirty ?? false
    );

    const initialState = {
        disableCheckbox: false,
        displayConfirmModal: false,
        displaySuccessModal: false,
        displayWarningModal: false,
        remainingCharacters: CHARACTER_LIMIT_FOR_CLOSING_ACCOUNT,
    };

    const reducer = (state: typeof initialState, action: TAccountClosureFormActions) => {
        switch (action.type) {
            case 'disableCheckbox': {
                const disableCheckbox =
                    Object.values(action.payload).filter(Boolean).length >= MAX_ALLOWED_REASONS_FOR_CLOSING_ACCOUNT;
                return { ...state, disableCheckbox };
            }

            case 'remainingCharacters': {
                const { doToImprove, otherTradingPlatforms } = action.payload;
                const remainingCharacters =
                    CHARACTER_LIMIT_FOR_CLOSING_ACCOUNT -
                    (doToImprove ?? '').concat(otherTradingPlatforms ?? '').length;
                return { ...state, remainingCharacters };
            }
            case 'displayConfirmModal': {
                return { ...state, displayConfirmModal: !state.displayConfirmModal };
            }
            case 'displaySuccessModal': {
                return { ...state, displaySuccessModal: !state.displaySuccessModal };
            }
            case 'displayWarningModal': {
                console.log('Setting state');
                return { ...state, displayWarningModal: !state.displayWarningModal };
            }
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <Fragment>
            <Formik
                initialValues={validationSchema.getDefault()}
                innerRef={formRef}
                onSubmit={() => dispatch({ payload: true, type: 'displayConfirmModal' })}
                validationSchema={validationSchema}
            >
                {({ dirty, setFieldValue, values }) => (
                    <Form>
                        <section>
                            <div className='flex flex-col gap-8 my-16'>
                                {reasons.map(({ label, ref, value }) => (
                                    <Field
                                        as={Checkbox}
                                        disabled={
                                            state.disableCheckbox &&
                                            !values[ref as keyof TAccountClosureReasonsFormValues]
                                        }
                                        key={value}
                                        label={label}
                                        name={ref}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setFieldValue(ref, event.target.checked);
                                            dispatch({
                                                payload: { ...values, [ref]: event.target.checked },
                                                type: 'disableCheckbox',
                                            });
                                        }}
                                        type='checkbox'
                                    />
                                ))}
                            </div>
                            <Field
                                aria-label="If you don't mind sharing, which other trading platforms do you use?"
                                as={TextArea}
                                className='mb-12'
                                label="If you don't mind sharing, which other trading platforms do you use?"
                                name='otherTradingPlatforms'
                                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    setFieldValue('otherTradingPlatforms', event.target.value);
                                    dispatch({
                                        payload: { ...values, otherTradingPlatforms: event.target.value },
                                        type: 'remainingCharacters',
                                    });
                                }}
                                role='textarea'
                                textSize='sm'
                            />
                            <Field
                                aria-label='What could we do to improve?'
                                as={TextArea}
                                hint={`Remaining characters: ${state.remainingCharacters}`}
                                label='What could we do to improve?'
                                name='doToImprove'
                                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    setFieldValue('doToImprove', event.target.value);
                                    dispatch({
                                        payload: { ...values, doToImprove: event.target.value },
                                        type: 'remainingCharacters',
                                    });
                                }}
                                role='textarea'
                                textSize='sm'
                            />
                        </section>
                        <section className='flex justify-end mt-24 gap-x-16'>
                            <Button
                                color='black'
                                onClick={handleOnBack}
                                rounded='sm'
                                size='md'
                                type='button'
                                variant='outlined'
                            >
                                Back
                            </Button>
                            <Button disabled={!dirty || isReasonNotSelected} rounded='sm' size='md' type='submit'>
                                Continue
                            </Button>
                        </section>
                        {isReasonNotSelected && (
                            <Text as='p' className='mt-16' color='error' size='xs' weight='bold'>
                                Please select at least one reason
                            </Text>
                        )}
                    </Form>
                )}
            </Formik>
            <AccountClosureConfirmModal
                handleCancel={() => dispatch({ payload: false, type: 'displayConfirmModal' })}
                handleSubmit={() => {
                    mutate({
                        payload: {
                            reason: getAccountClosureReasons(
                                formRef?.current?.values as TAccountClosureReasonsFormValues
                            ),
                        },
                    });
                    dispatch({ payload: false, type: 'displayConfirmModal' });
                }}
                isModalOpen={state.displayConfirmModal}
            />
            <AccountClosureSuccessModal
                handleClose={() => dispatch({ payload: false, type: 'displaySuccessModal' })}
                isModalOpen={state.displaySuccessModal}
            />
            <AccountClosureWarningModal
                error={error?.error as TAccountClosureError}
                handleClose={() => dispatch({ payload: false, type: 'displayWarningModal' })}
                isModalOpen={state.displayWarningModal}
            />
        </Fragment>
    );
};
