import * as React from 'react';
import { Formik, Field } from 'formik';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Autocomplete, Icon, Text, useOnClickOutside } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { useStores } from 'Stores';
import { localize, Localize } from 'Components/i18next';
import PaymentMethodIcon from 'Components/payment-method-icon';
import PropTypes from 'prop-types';
import './buy-ad-payment-methods-list.scss';

const BuyAdPaymentMethodsList = ({
    is_alignment_top,
    list_portal_id,
    selected_methods,
    setSelectedMethods,
    should_show_hint,
    touched,
}) => {
    const { isDesktop } = useDevice();
    const { my_ads_store, my_profile_store } = useStores();
    const [selected_edit_method, setSelectedEditMethod] = React.useState();
    const [payment_methods_list, setPaymentMethodsList] = React.useState([]);
    const [close_icon, setCloseIcon] = React.useState(false);
    const [show_list, setShowList] = React.useState(false);
    const [hide_list, setHideList] = React.useState(false);
    const deleted_autocomplete_ref = React.useRef();

    const MAX_PAYMENT_METHOD_SELECTION = 3;

    useOnClickOutside(deleted_autocomplete_ref, () => {
        setShowList(false);
        setHideList(true);
        my_ads_store.setCurrentMethod({ key: null, is_deleted: false });
    });

    React.useEffect(() => {
        const disposeAddPaymentMethodsList = reaction(
            () => my_profile_store.payment_methods_list,
            () =>
                setPaymentMethodsList(
                    my_profile_store.payment_methods_list.filter(({ value }) => !selected_methods.includes(value))
                )
        );

        return disposeAddPaymentMethodsList;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        setPaymentMethodsList(
            my_profile_store.payment_methods_list.filter(({ value }) => !selected_methods.includes(value))
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hide_list, show_list, selected_methods]);

    const onClickDeletePaymentMethodItem = value => {
        if (value) {
            my_ads_store.payment_method_names = my_ads_store.payment_method_names.filter(
                payment_method_id => payment_method_id !== value
            );
            setSelectedMethods(selected_methods.filter(i => i !== value));
            setPaymentMethodsList([
                ...payment_methods_list,
                {
                    value,
                    text: my_profile_store.getPaymentMethodDisplayName(value),
                },
            ]);
            if (typeof touched === 'function') touched(true);
        }
    };

    const onEditPaymentMethodItem = (value, index) => {
        if (value) {
            if (close_icon && selected_methods.length > 1) {
                setCloseIcon(false);
                my_ads_store.setCurrentMethod({ ...my_ads_store.current_method, is_deleted: true });
            } else if (close_icon && selected_methods.length === 1) {
                onClickDeletePaymentMethodItem(selected_methods[0]);
                my_ads_store.setCurrentMethod({ ...my_ads_store.current_method, key: null, is_deleted: false });
                setCloseIcon(false);
            } else {
                const edited_methods = [...selected_methods];
                edited_methods[index] = value;
                my_ads_store.payment_method_names[index] = value;
                setSelectedMethods(edited_methods);
                setPaymentMethodsList([
                    ...payment_methods_list.filter(payment_method => payment_method.value !== value),
                    selected_edit_method,
                ]);
                if (typeof touched === 'function') touched(true);
            }
        }
    };

    const onClickPaymentMethodItem = value => {
        if (value && !my_ads_store.payment_method_names.includes(value)) {
            if (my_ads_store.current_method.is_deleted) {
                onEditPaymentMethodItem(value, my_ads_store.current_method.key);
                my_ads_store.setCurrentMethod({ ...my_ads_store.current_method, key: null, is_deleted: false });
                setShowList(false);
                setHideList(true);
            } else if (my_ads_store.payment_method_names.length < MAX_PAYMENT_METHOD_SELECTION) {
                setSelectedMethods([...selected_methods, value]);
                my_ads_store.payment_method_names.push(value);
                setPaymentMethodsList(payment_methods_list.filter(payment_method => payment_method.value !== value));
            }
            if (typeof touched === 'function') touched(true);
        }
    };

    const onClickIcon = (payment_method, key, setFieldValue) => {
        if (close_icon) {
            onEditPaymentMethodItem(payment_method, key);
            setShowList(true);
            setFieldValue('payment_method', '');
        } else if (!close_icon && !my_ads_store.current_method.is_deleted) {
            onClickDeletePaymentMethodItem(payment_method);
        }
    };

    if (selected_methods?.length > 0) {
        return (
            <div className='buy-ad-payment-methods-list__container'>
                {selected_methods.map((payment_method, key) => {
                    const method = my_profile_store.getPaymentMethodDisplayName(payment_method);

                    return (
                        <Formik key={key} enableReinitialize initialValues={{ payment_method: method }}>
                            {({ setFieldValue }) => (
                                <Field name='payment_method'>
                                    {({ field }) =>
                                        my_ads_store.current_method.key === key &&
                                        my_ads_store.current_method.is_deleted ? (
                                            <div className='my-ads--border' ref={deleted_autocomplete_ref}>
                                                <Autocomplete
                                                    {...field}
                                                    autoComplete='off' // prevent chrome autocomplete
                                                    className='buy-ad-payment-methods-list__input'
                                                    data-lpignore='true'
                                                    hide_list={hide_list}
                                                    is_alignment_top={is_alignment_top}
                                                    leading_icon={<Icon icon='IcAddOutline' size={14} />}
                                                    list_items={payment_methods_list}
                                                    list_portal_id={list_portal_id ?? 'deriv_app'}
                                                    onBlur={e => {
                                                        e.preventDefault();
                                                        setFieldValue('payment_method', '');
                                                    }}
                                                    onItemSelection={({ value }) => {
                                                        setTimeout(onClickPaymentMethodItem(value), 0);
                                                    }}
                                                    placeholder={localize('Add')}
                                                    required
                                                    show_list={show_list}
                                                    trailing_icon={
                                                        field.value ? (
                                                            <Icon
                                                                className='buy-ad-payment-methods-list__icon'
                                                                color='secondary'
                                                                icon='IcCloseCircle'
                                                                onClick={() => {
                                                                    setFieldValue('payment_method', '');
                                                                }}
                                                            />
                                                        ) : (
                                                            <></>
                                                        )
                                                    }
                                                    type='text'
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <Autocomplete
                                                    {...field}
                                                    autoComplete='off' // prevent chrome autocomplete
                                                    className='buy-ad-payment-methods-list__input'
                                                    data-lpignore='true'
                                                    hide_list={hide_list}
                                                    is_alignment_top={is_alignment_top}
                                                    leading_icon={<PaymentMethodIcon display_name={method} />}
                                                    list_items={[method]}
                                                    list_portal_id={list_portal_id ?? 'deriv_app'}
                                                    onBlur={e => {
                                                        e.preventDefault();
                                                        setFieldValue('payment_method', method);
                                                        setCloseIcon(false);
                                                    }}
                                                    onHideDropdownList={() => {
                                                        setFieldValue('payment_method', method);
                                                        setCloseIcon(false);
                                                    }}
                                                    onItemSelection={({ value }) => {
                                                        onEditPaymentMethodItem(value, key);
                                                    }}
                                                    onFocus={e => {
                                                        e.preventDefault();
                                                        setCloseIcon(true);
                                                        setHideList(false);
                                                        setFieldValue('payment_method', method);
                                                        if (!my_ads_store.current_method.is_deleted) {
                                                            setSelectedEditMethod({
                                                                value: payment_method,
                                                                text: method,
                                                            });
                                                            my_ads_store.setCurrentMethod({
                                                                ...my_ads_store.current_method,
                                                                key,
                                                            });
                                                        }
                                                    }}
                                                    onShowDropdownList={() => {
                                                        setCloseIcon(true);
                                                    }}
                                                    required
                                                    trailing_icon={
                                                        <Icon
                                                            className='buy-ad-payment-methods-list__icon'
                                                            color={
                                                                close_icon && my_ads_store.current_method.key === key
                                                                    ? 'secondary'
                                                                    : 'black'
                                                            }
                                                            icon={
                                                                close_icon && my_ads_store.current_method.key === key
                                                                    ? 'IcCloseCircle'
                                                                    : 'IcDelete'
                                                            }
                                                            onTouchStart={e => {
                                                                e.preventDefault();
                                                                if (!isDesktop)
                                                                    onClickIcon(payment_method, key, setFieldValue);
                                                            }}
                                                            onMouseDown={() => {
                                                                if (isDesktop && my_ads_store.show_ad_form)
                                                                    onClickIcon(payment_method, key, setFieldValue);
                                                            }}
                                                            onClick={() => {
                                                                if (isDesktop && !my_ads_store.show_ad_form) {
                                                                    onClickIcon(payment_method, key, setFieldValue);
                                                                }
                                                            }}
                                                        />
                                                    }
                                                    type='text'
                                                />
                                            </div>
                                        )
                                    }
                                </Field>
                            )}
                        </Formik>
                    );
                })}
                {my_ads_store.payment_method_names.length < MAX_PAYMENT_METHOD_SELECTION &&
                    payment_methods_list.length > 0 &&
                    !my_ads_store.current_method.is_deleted && (
                        <Formik enableReinitialize initialValues={{ payment_method: '' }}>
                            {({ setFieldValue }) => (
                                <Field name='payment_method'>
                                    {({ field }) => (
                                        <div className='my-ads--border'>
                                            <Autocomplete
                                                {...field}
                                                autoComplete='off' // prevent chrome autocomplete
                                                className='buy-ad-payment-methods-list__input'
                                                data-lpignore='true'
                                                is_alignment_top={is_alignment_top}
                                                leading_icon={<Icon icon='IcAddOutline' size={14} />}
                                                list_items={payment_methods_list}
                                                list_portal_id={list_portal_id ?? 'deriv_app'}
                                                onItemSelection={({ value }) =>
                                                    setTimeout(() => onClickPaymentMethodItem(value), 0)
                                                }
                                                onBlur={e => {
                                                    e.preventDefault();
                                                    setFieldValue('payment_method', '');
                                                }}
                                                placeholder={localize('Add')}
                                                required
                                                trailing_icon={<></>}
                                                type='text'
                                            />
                                        </div>
                                    )}
                                </Field>
                            )}
                        </Formik>
                    )}
                {should_show_hint &&
                    !selected_methods.includes('other') &&
                    selected_methods.length < MAX_PAYMENT_METHOD_SELECTION && (
                        <Localize
                            i18n_default_text='<0>Don’t see your payment method?</0> <1>Add new.</1>'
                            components={[
                                <Text key={0} color='less-prominent' size='xxs' />,
                                <Text
                                    key={1}
                                    className='link'
                                    size='xxs'
                                    onClick={() => onClickPaymentMethodItem('other')}
                                />,
                            ]}
                        />
                    )}
            </div>
        );
    }

    return (
        <div className='buy-ad-payment-methods-list__container'>
            <Formik enableReinitialize initialValues={{ payment_method: '' }}>
                {({ setFieldValue }) => (
                    <Field name='payment_method'>
                        {({ field }) => (
                            <div className='my-ads--border'>
                                <Autocomplete
                                    {...field}
                                    autoComplete='off' // prevent chrome autocomplete
                                    className='buy-ad-payment-methods-list__input'
                                    data-lpignore='true'
                                    is_alignment_top={is_alignment_top}
                                    leading_icon={<Icon icon='IcAddOutline' size={14} />}
                                    list_items={payment_methods_list}
                                    list_portal_id={list_portal_id ?? 'deriv_app'}
                                    onItemSelection={({ text, value }) => {
                                        setFieldValue('payment_method', value ? text : '');
                                        setTimeout(() => onClickPaymentMethodItem(value), 0);
                                    }}
                                    placeholder={localize('Add')}
                                    required
                                    trailing_icon={<></>}
                                    type='text'
                                />
                            </div>
                        )}
                    </Field>
                )}
            </Formik>
            {should_show_hint && (
                <Localize
                    i18n_default_text='<0>Don’t see your payment method?</0> <1>Add new.</1>'
                    components={[
                        <Text key={0} color='less-prominent' size='xxs' />,
                        <Text key={1} className='link' size='xxs' onClick={() => onClickPaymentMethodItem('other')} />,
                    ]}
                />
            )}
        </div>
    );
};

BuyAdPaymentMethodsList.propTypes = {
    selected_methods: PropTypes.array,
    setSelectedMethods: PropTypes.func,
    touched: PropTypes.func,
};

export default observer(BuyAdPaymentMethodsList);
