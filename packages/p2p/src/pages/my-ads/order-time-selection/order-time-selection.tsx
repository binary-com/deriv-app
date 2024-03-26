import React from 'react';
import { FormikHandlers, FormikValues, useFormikContext } from 'formik';
import { Dropdown, Icon, Popover, Text } from '@deriv/components';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStore } from '@deriv/stores';

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
    const { showModal } = useModalManagerContext();
    const { ui } = useStore();
    const { is_mobile } = ui;
    const order_time_info_message = localize('Orders will expire if they aren’t completed within this time.');
    const order_completion_time_list = [
        {
            text: localize('1 hour'),
            value: '3600',
        },
        {
            text: localize('45 minutes'),
            value: '2700',
        },
        {
            text: localize('30 minutes'),
            value: '1800',
        },
        {
            text: localize('15 minutes'),
            value: '900',
        },
    ];

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
                list={order_completion_time_list}
                onChange={handleChange}
                value={values.order_completion_time}
            />
        </div>
    );
};

export default OrderTimeSelection;
