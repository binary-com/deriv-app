import React, { ChangeEvent, useRef, useState } from 'react';
import clsx from 'clsx';
import { Field, FieldProps, FormikErrors, useFormikContext } from 'formik';
import { StandaloneXmarkRegularIcon } from '@deriv/quill-icons';
import { Button, Input } from '@deriv-com/ui';
import { TPaymentMethod, TProofOfOwnershipFormValue } from 'src/types';
import { compressImageFiles, TFile } from 'src/utils';

type TFileUploadFieldProps = {
    methodId: number | string;
    paymentMethod: TPaymentMethod;
    subIndex: number | string;
};

export const FileUploaderField = ({ methodId, paymentMethod, subIndex }: TFileUploadFieldProps) => {
    const formik = useFormikContext<TProofOfOwnershipFormValue>();
    const { errors, setFieldValue, values } = formik;
    const [showBrowseButton, setShowBrowseButton] = useState(
        !values[paymentMethod]?.[methodId]?.files?.[subIndex as number]?.name
    );

    if (!formik) {
        throw new Error('FileUploaderField must be used within a Formik component');
    }

    // Create a reference to the hidden file input element
    const hiddenInputFieldRef = useRef<HTMLInputElement>(null);

    const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
        event.nativeEvent.preventDefault();
        event.nativeEvent.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        // Check if files exist before proceeding
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }
        const fileToUpload = await compressImageFiles([event.target.files[0]]);
        const paymentFileData = [...(values[paymentMethod]?.[methodId]?.files ?? [])];
        paymentFileData[subIndex as number] = fileToUpload[0] as TFile;
        const selectedPaymentMethod = values?.[paymentMethod];
        if (!selectedPaymentMethod) {
            return;
        }
        selectedPaymentMethod[methodId] = {
            ...selectedPaymentMethod[methodId],
            files: paymentFileData ?? [],
        };
        await setFieldValue(paymentMethod, { ...selectedPaymentMethod });
        setShowBrowseButton(!fileToUpload[0]);
    };

    const handleClick = (e: React.MouseEvent) => {
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        hiddenInputFieldRef?.current?.click();
    };

    const updateError = () => {
        const paymentMethodError = errors?.[paymentMethod] ?? {};
        const paymentMethodFileError = (paymentMethodError?.[methodId]?.files as FormikErrors<TFile>[]) ?? {};

        delete paymentMethodFileError?.[subIndex as number];
        paymentMethodError[methodId] = {
            ...(paymentMethodError[methodId] ?? {}),
            files: paymentMethodFileError,
        };

        if (Object.keys(paymentMethodError[methodId]?.files as object).length === 0) {
            delete paymentMethodError[methodId]?.paymentMethodIdentifier;
        }
    };

    const handleIconClick = async (e: React.MouseEvent) => {
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        if (hiddenInputFieldRef.current && 'value' in hiddenInputFieldRef.current) {
            hiddenInputFieldRef.current.value = '';
        }
        const paymentFileData = values[paymentMethod]?.[methodId]?.files ?? [];
        const filteredFileData = paymentFileData.filter((_, i) => i !== subIndex);
        const selectedPaymentMethod = values?.[paymentMethod];
        if (!selectedPaymentMethod) {
            return;
        }
        selectedPaymentMethod[methodId] = {
            ...selectedPaymentMethod[methodId],
            files: filteredFileData,
        };
        await setFieldValue(paymentMethod, { ...selectedPaymentMethod });
        setShowBrowseButton(prevState => !prevState);
        updateError();
    };

    return (
        <Field name={paymentMethod}>
            {({ field, form, meta }: FieldProps<string>) => {
                const errorMessage = errors?.[paymentMethod]?.[methodId]?.files?.[subIndex as number];
                return (
                    <div>
                        <input
                            accept='image/png, image/jpeg, image/jpg, application/pdf'
                            className='hidden-input'
                            name={paymentMethod}
                            onChange={handleChange}
                            ref={hiddenInputFieldRef}
                            type='file'
                        />
                        <Input
                            error={Boolean(errorMessage)}
                            label='Choose a photo'
                            maxLength={255}
                            message={
                                errorMessage
                                    ? errorMessage?.toString()
                                    : 'Accepted formats: pdf, jpeg, jpg, and png. Max file size: 8MB'
                            }
                            name='cardImgName'
                            readOnly
                            rightPlaceholder={
                                <Button
                                    className={clsx({ hidden: showBrowseButton })}
                                    color='white'
                                    onClick={handleIconClick}
                                    size='md'
                                    type='button'
                                    variant='ghost'
                                >
                                    <StandaloneXmarkRegularIcon height={20} width={20} />
                                </Button>
                            }
                            type='text'
                            value={values[paymentMethod]?.[methodId]?.files?.[subIndex as number]?.name ?? ''}
                        />
                        <Button onClick={handleClick} size='md' type='button'>
                            Browse
                        </Button>
                    </div>
                );
            }}
        </Field>
    );
};
