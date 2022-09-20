import React from 'react';
import { Field as FormField, Formik, Form, FieldProps } from 'formik';
import { Input, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

type TSearchBox = {
    is_search_loading: boolean;
    onSearch: () => void;
    onSearchBlur: () => void;
    onSearchClear: (
        param: (field: string, value: number | string, shouldValidate?: boolean | undefined) => void
    ) => void;
    onSearchKeyUp: (param: () => void) => void;
};

type TFormValues = { [key: string]: string };

const SearchBox = ({ is_search_loading, onSearch, onSearchBlur, onSearchClear, onSearchKeyUp }: TSearchBox) => (
    <div className='db-toolbox__search'>
        <Formik initialValues={{ search: '' }} onSubmit={onSearch}>
            {({ submitForm, values: { search }, setFieldValue }) => (
                <Form>
                    <FormField name='search'>
                        {({ field }: FieldProps<string, TFormValues>) => (
                            <Input
                                {...field}
                                className='db-toolbox__search-field'
                                type='text'
                                name='search'
                                placeholder={localize('Search')}
                                onKeyUp={() => onSearchKeyUp(submitForm)}
                                onFocus={submitForm}
                                onBlur={onSearchBlur}
                                leading_icon={
                                    (search &&
                                        (is_search_loading ? (
                                            <div className='loader' />
                                        ) : (
                                            <Icon
                                                icon='IcCloseCircle'
                                                onClick={() => onSearchClear(setFieldValue)}
                                                color='secondary'
                                            />
                                        ))) ||
                                    (!search && <Icon icon='IcSearch' />)
                                }
                            />
                        )}
                    </FormField>
                </Form>
            )}
        </Formik>
    </div>
);

export default SearchBox;
