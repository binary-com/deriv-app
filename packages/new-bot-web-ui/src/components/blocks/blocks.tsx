import React from 'react';
import { Autocomplete, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { observer } from '@deriv/stores';
import { Form, Formik, FormikProps } from 'formik';
import { BlocksFields } from './blocks-components';

const Blocks: React.FC = () => {
    const {
        blocks: {
            initial_values,
            loadDataStrategy,
            markets_dropdown,
            submarkets_dropdown,
            symbols_dropdown,
            trade_type_category_dropdown,
            trade_type_dropdown,
            onHideDropdownList,
            onChangeDropdownItem,
            onScrollStopDropdownList,
            exportStrategyToJson,
        },
    } = useDBotStore();

    React.useEffect(() => {
        loadDataStrategy();
    }, []);

    return (
        <div className='bot-builder__wrapper'>
            <div className='bot-builder__container'>
                <div className='bot-builder__header'>
                    <Text color='colored-background'>{localize('1. Trade parameters:')}</Text>
                </div>
                <Formik
                    initialValues={initial_values}
                    onSubmit={values => {
                        exportStrategyToJson(values);
                        // console.log(JSON.stringify(values, null, 2));
                    }}
                    enableReinitialize={true}
                    validateOnMount={true}
                >
                    {({ errors, handleChange, values, isSubmitting, setFieldValue, submitForm }: FormikProps<any>) => {
                        return (
                            <Form className={'bot-builder__form'}>
                                <BlocksFields
                                    markets_dropdown={markets_dropdown}
                                    submarkets_dropdown={submarkets_dropdown}
                                    symbols_dropdown={symbols_dropdown}
                                    trade_type_category_dropdown={trade_type_category_dropdown}
                                    trade_type_dropdown={trade_type_dropdown}
                                    onChangeDropdownItem={onChangeDropdownItem}
                                    onHideDropdownList={onHideDropdownList}
                                    setFieldValue={setFieldValue}
                                    onScrollStopDropdownList={onScrollStopDropdownList}
                                    // handleChange={handleChange}
                                    // onChangeInputValue={onChangeInputValue}
                                    // setCurrentFocus={setCurrentFocus}
                                    values={values}
                                    // errors={errors}
                                />
                                <button type='submit' disabled={isSubmitting}>
                                    Save strategy
                                </button>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
};

export default observer(Blocks);
