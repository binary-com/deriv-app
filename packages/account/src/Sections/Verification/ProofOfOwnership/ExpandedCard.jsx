import React, { useState } from 'react';
import FileUploader from './FileUploader.jsx';
import { Input, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import SampleCreditCardModal from 'Components/sample-credit-card-modal';

const ExpandedCard = ({ cardDetails, handleChange, handleBlur, identifier, values, setFieldValue, index, error }) => {
    const [is_sample_modal_open, setIsSampleModalOpen] = useState(false);

    const handleUploadedFile = (name, file) => {
        setFieldValue(name, file);
    };

    const exampleLink = () =>
        cardDetails.icon === 'IcCreditCard' ? (
            <span
                className='proof-of-ownership__card-open-desc-link'
                key={0}
                onClick={() => {
                    setIsSampleModalOpen(true);
                }}
            >
                {localize('See example')}
            </span>
        ) : (
            ''
        );

    const formatIdentifier = (id, type) => {
        let formattedID = id;
        if (type === 'IcCreditCard') formattedID = `${id.substr(0, 6)}XXXXXX${id.substr(12)}`;
        else if (type === 'IcEwallet') return formattedID;
        return formattedID
            .replace(/\s/g, '')
            .replace(/(\w{4})/g, '$1 ')
            .trim();
    };

    return (
        <>
            <div>
                {cardDetails.paragraphs.map((para, idx) => (
                    <Text className='proof-of-ownership__card-open-desc' as='p' color='general' size='xs' key={idx}>
                        {para} {exampleLink()}
                    </Text>
                ))}
                <fieldset>
                    <div className='proof-of-ownership__card-open-inputs'>
                        {cardDetails.input_label && (
                            <div className='proof-of-ownership__card-open-inputs-field'>
                                <Input
                                    label={cardDetails.input_label}
                                    data-lpignore='true'
                                    className='proof-of-ownership__card-open-inputs-cardnumber'
                                    type='text'
                                    onChange={handleChange}
                                    disabled
                                    value={formatIdentifier(identifier, cardDetails.icon)}
                                    onBlur={handleBlur}
                                    maxLength='19'
                                />
                            </div>
                        )}
                        <div className='proof-of-ownership__card-open-inputs-upload'>
                            <FileUploader
                                handleFile={handleUploadedFile}
                                fileName={values?.data?.[index]?.file?.name}
                                dataTestID={`uploader-${values?.data?.[index]?.id}`}
                                className='proof-of-ownership__card-open-inputs-photo'
                                name={`data[${index}].file`}
                                error={error?.file}
                            />
                            {cardDetails.icon === 'IcOnlineNaira' && (
                                <FileUploader
                                    handleFile={handleUploadedFile}
                                    fileName={values?.data?.[index]?.file?.name}
                                    dataTestID={`uploader-${values?.data?.[index]?.id}`}
                                    className='proof-of-ownership__card-open-inputs-photo'
                                    name={`data[${index}].file`}
                                    error={error?.file}
                                />
                            )}
                        </div>
                    </div>
                </fieldset>
            </div>
            <SampleCreditCardModal
                is_open={is_sample_modal_open}
                onClose={() => {
                    setIsSampleModalOpen(false);
                }}
            />
        </>
    );
};

export default ExpandedCard;
