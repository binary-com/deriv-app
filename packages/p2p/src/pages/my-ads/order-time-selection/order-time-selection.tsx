import React from 'react';
import { FormikHandlers, FormikValues, useFormikContext } from 'formik';
import { Dropdown, Icon, Popover, Text } from '@deriv/components';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStore } from '@deriv/stores';
import { useP2PSettings } from '@deriv/hooks';
import { formatTime } from 'Utils/orders';

type TFormikContext = {
    handleChange: FormikHandlers['handleChange'];
    values: FormikValues;
};

type TOrderTimeSelectionProps = {
    classNameDisplay?: string;
    classNameIcon?: string;
    is_label_hidden?: boolean;
};

const OrderTimeSelection = ({
    classNameDisplay,
    classNameIcon,
    is_label_hidden = false,
    ...field
}: TOrderTimeSelectionProps) => {
    const { values, handleChange }: TFormikContext = useFormikContext<TFormikContext>();
    const { order_completion_time } = values;
    const { showModal } = useModalManagerContext();
    const { p2p_settings } = useP2PSettings();
    const { order_expiry_options } = p2p_settings ?? {};
    const { ui } = useStore();
    const { is_mobile } = ui;
    const order_time_info_message = localize('Orders will expire if they aren’t completed within this time.');

    const getOrderExpiryOptions = (
        order_expiry_options: NonNullable<
            NonNullable<ReturnType<typeof useP2PSettings>>['p2p_settings']
        >['order_expiry_options']
    ) => {
        const options = order_expiry_options?.map(option => ({
            text: formatTime(option / 60),
            value: `${option}`,
        }));
        if (options?.some(option => option.value === order_completion_time)) return options;
        return (
            options?.concat({
                text: formatTime(Number(order_completion_time) / 60),
                value: order_completion_time,
            }) ?? []
        );
    };

    return (
        <div className='order-time-selection'>
            {!is_label_hidden && (
                <div className='order-time-selection__title'>
                    <Text color='prominent' size='xs' line_height='xl'>
                        <Localize i18n_default_text='Orders must be completed in' />
                    </Text>
                    <Popover
                        alignment='top'
                        classNameBubble='order-time-selection__popover'
                        message={<Localize i18n_default_text={order_time_info_message} />}
                    >
                        <Icon
                            data_testid='dt_order_time_selection_info_icon'
                            icon='IcInfoOutline'
                            onClick={() =>
                                is_mobile &&
                                showModal({ key: 'OrderTimeTooltipModal', props: { order_time_info_message } })
                            }
                        />
                    </Popover>
                </div>
            )}
            <Dropdown
                {...field}
                className='order-time-selection__time-dropdown'
                classNameDisplay={classNameDisplay}
                classNameIcon={classNameIcon}
                is_align_text_left
                list={getOrderExpiryOptions(order_expiry_options)}
                onChange={handleChange}
                value={values.order_completion_time}
            />
        </div>
    );
};

export default OrderTimeSelection;
