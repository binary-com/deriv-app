import React from 'react';
import { ActionSheet, Chip, Text, TextField, TextFieldAddon } from '@deriv-com/quill-ui';

import { localize, Localize } from '@deriv/translations';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';

const chips_options = [
    {
        name: <Localize i18n_default_text='Above spot' />,
    },
    {
        name: <Localize i18n_default_text='Below spot' />,
    },
    {
        name: <Localize i18n_default_text='Fixed price' />,
    },
];
const BarrierInput = observer(
    ({
        setInitialBarrierValue,
        isDays,
        onClose,
    }: {
        setInitialBarrierValue: (val: string) => void;
        isDays: boolean;
        onClose: (val: boolean) => void;
    }) => {
        const { barrier_1, onChange, validation_errors, tick_data, setV2ParamsInitialValues } = useTraderStore();
        const [option, setOption] = React.useState(0);
        const { pip_size } = tick_data ?? {};

        React.useEffect(() => {
            setInitialBarrierValue(barrier_1);
            setV2ParamsInitialValues({ name: 'barrier_1', value: barrier_1 });
            if (barrier_1.includes('-')) {
                setOption(1);
            } else if (barrier_1.includes('+')) {
                setOption(0);
            } else {
                setOption(2);
            }
            onChange({ target: { name: 'barrier_1', value: barrier_1 } });
        }, []);

        const handleChipSelect = (index: number) => {
            setOption(index);
            let newValue = barrier_1.replace(/^[+-]/, '');

            if (index === 0) {
                newValue = `+${newValue}`;
            } else if (index === 1) {
                newValue = `-${newValue}`;
            }

            if ((newValue.startsWith('+') || newValue.startsWith('-')) && newValue.charAt(1) === '.') {
                newValue = `${newValue.charAt(0)}0${newValue.slice(1)}`;
            } else if (newValue.startsWith('.')) {
                newValue = `0${newValue}`;
            }

            onChange({ target: { name: 'barrier_1', value: newValue } });
        };

        const handleOnChange = (e: { target: { name: string; value: string } }) => {
            let value = e.target.value;
            if (option === 0) value = `+${value}`;
            if (option === 1) value = `-${value}`;
            onChange({ target: { name: 'barrier_1', value } });
            setV2ParamsInitialValues({ name: 'barrier_1', value });
        };

        return (
            <>
                <ActionSheet.Content>
                    <div className='barrier-params'>
                        {!isDays && (
                            <div className='barrier-params__chips'>
                                {chips_options.map((item, index) => (
                                    <Chip.Selectable
                                        key={index}
                                        onClick={() => handleChipSelect(index)}
                                        selected={index == option}
                                    >
                                        <Text size='sm'>{item.name}</Text>
                                    </Chip.Selectable>
                                ))}
                            </div>
                        )}

                        <div>
                            {option === 2 || isDays ? (
                                <TextField
                                    customType='commaRemoval'
                                    name='barrier_1'
                                    noStatusIcon
                                    status={
                                        validation_errors?.barrier_1.length > 0 && barrier_1 !== ''
                                            ? 'error'
                                            : 'neutral'
                                    }
                                    value={barrier_1}
                                    allowDecimals
                                    decimals={pip_size}
                                    allowSign={false}
                                    inputMode='decimal'
                                    regex={/[^0-9.,]/g}
                                    textAlignment='center'
                                    onChange={handleOnChange}
                                    placeholder={localize('Price')}
                                    variant='fill'
                                    message={barrier_1 !== '' ? validation_errors?.barrier_1[0] : ''}
                                />
                            ) : (
                                <TextFieldAddon
                                    fillAddonBorderColor='var(--semantic-color-slate-solid-surface-frame-mid)'
                                    customType='commaRemoval'
                                    name='barrier_1'
                                    noStatusIcon
                                    addonLabel={option == 0 ? '+' : '-'}
                                    decimals={pip_size}
                                    value={barrier_1.replace(/[+-]/g, '')}
                                    allowDecimals
                                    inputMode='decimal'
                                    allowSign={false}
                                    status={
                                        validation_errors?.barrier_1.length > 0 && barrier_1 !== ''
                                            ? 'error'
                                            : 'neutral'
                                    }
                                    onChange={handleOnChange}
                                    placeholder={localize('Distance to spot')}
                                    regex={/[^0-9.,]/g}
                                    variant='fill'
                                    message={barrier_1 !== '' ? validation_errors?.barrier_1[0] : ''}
                                />
                            )}
                            {(validation_errors?.barrier_1.length == 0 || barrier_1 === '') && (
                                <div className='barrier-params__error-area' />
                            )}
                        </div>
                        <div className='barrier-params__current-spot-wrapper'>
                            <Text size='sm'>
                                <Localize i18n_default_text='Current spot' />
                            </Text>
                            <Text size='sm'>{tick_data?.quote}</Text>
                        </div>
                    </div>
                </ActionSheet.Content>
                <ActionSheet.Footer
                    alignment='vertical'
                    shouldCloseOnPrimaryButtonClick={false}
                    primaryAction={{
                        content: <Localize i18n_default_text='Save' />,
                        onAction: () => {
                            if (validation_errors.barrier_1.length === 0) {
                                onClose(true);
                            }
                        },
                    }}
                />
            </>
        );
    }
);

export default BarrierInput;
