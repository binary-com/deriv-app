import React from 'react';
import { StandaloneChevronRightRegularIcon } from '@deriv/quill-icons';
import { Button, Divider, Text, useDevice } from '@deriv-com/ui';
import { Card } from '../../components/Card';
import { getManualUploadDocumentList } from '../../constants/manualDocument';

type TDocumentSelection = {
    countryCode: string;
    handleOnClick: (value: string) => void;
    onCancel: () => void;
};

export const DocumentSelection = ({ countryCode, handleOnClick, onCancel }: TDocumentSelection) => {
    const { isMobile } = useDevice();

    const documentList = getManualUploadDocumentList(countryCode === 'ng');

    return (
        <div className='grid h-full'>
            <section className='flex flex-col gap-18'>
                <Text as='h2' className='mt-32' color='prominent' size='sm'>
                    Please upload one of the following documents:
                </Text>
                {documentList.map(({ description, icon: Icon, title, value }) => (
                    <Card
                        className='flex flex-row items-center cursor-pointer'
                        data-testid='dt_manual_document_types'
                        key={value}
                        onClick={() => handleOnClick(value)}
                    >
                        <Icon />
                        <div className='flex flex-col flex-grow ml-24 gap-8'>
                            <Text as='p' color='prominent' size={isMobile ? 'xs' : 'sm'} weight='bold'>
                                {title}
                            </Text>
                            <Text as='p' size={isMobile ? '2xs' : 'xs'}>
                                {description}
                            </Text>
                        </div>
                        <StandaloneChevronRightRegularIcon />
                    </Card>
                ))}
            </section>
            <section className='flex flex-col justify-end gap-8'>
                <Divider />
                <Button
                    className='flex self-end'
                    color='black'
                    onClick={onCancel}
                    rounded='sm'
                    size='lg'
                    type='button'
                    variant='outlined'
                >
                    Back
                </Button>
            </section>
        </div>
    );
};
