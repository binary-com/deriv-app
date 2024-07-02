import React from 'react';
import { Field as FormField, Formik, Form, FormikValues } from 'formik';
import debounce from 'lodash.debounce';
import { Icon, Input } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './filter-modal-search.scss';

const FilterModalSearch = () => {
    let typing_timer: NodeJS.Timeout | undefined;
    const { buy_sell_store, my_profile_store } = useStores();
    const { setIsFilterModalLoading } = buy_sell_store;
    const { getPaymentMethodsList, setSearchResults, setSearchTerm } = my_profile_store;
    const { isDesktop } = useDevice();

    const returnedFunction = debounce(() => {
        getPaymentMethodsList();
    }, 1000);

    const onSearch = ({ search }: { search: string }) => {
        setSearchTerm(search.trim());

        if (!search.trim()) {
            setSearchResults([]);
            return;
        }

        setIsFilterModalLoading(true);
        returnedFunction();
    };

    const onSearchClear = (setFieldValue: (name: string, value: string) => void) => {
        setFieldValue('search', '');
        setSearchTerm('');
        setSearchResults([]);
    };

    const onSearchKeyUp = (submitForm: VoidFunction) => {
        clearTimeout(typing_timer);

        typing_timer = setTimeout(() => {
            submitForm();
        }, 1000);
    };

    return (
        <div className='filter-modal-search'>
            <Formik initialValues={{ search: '' }} onSubmit={onSearch}>
                {({ submitForm, values: { search }, setFieldValue }) => (
                    <Form>
                        <FormField name='search'>
                            {({ field }: FormikValues) => (
                                <Input
                                    {...field}
                                    className='filter-modal-search__field'
                                    data-lpignore='true'
                                    leading_icon={<Icon className='filter-modal-search__field-icon' icon='IcSearch' />}
                                    name='search'
                                    onFocus={submitForm}
                                    onKeyUp={() => onSearchKeyUp(submitForm)}
                                    placeholder={isDesktop ? localize('Search payment method') : localize('Search')}
                                    trailing_icon={
                                        search ? (
                                            <Icon
                                                className='filter-modal-search__cross-icon'
                                                color='secondary'
                                                data_testid='dt_filter_modal_search_icon'
                                                icon='IcCloseCircle'
                                                onClick={() => onSearchClear(setFieldValue)}
                                            />
                                        ) : null
                                    }
                                    type='text'
                                />
                            )}
                        </FormField>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default observer(FilterModalSearch);
