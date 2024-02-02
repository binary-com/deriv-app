import React, { useEffect, useMemo, useState } from 'react';
import { p2p } from '@deriv/api';
import { Button, Loader, useDevice } from '@deriv-com/ui';
import { FullPageMobileWrapper, TextArea } from '../../../../components';
import { useQueryString } from '../../../../hooks';
import './MyProfileAdDetails.scss';

type TMYProfileAdDetailsTextAreaProps = {
    advertiserInfo: NonNullable<ReturnType<typeof p2p.advertiser.useGetInfo>>['data'];
    setAdvertDescription: React.Dispatch<React.SetStateAction<string>>;
    setContactInfo: React.Dispatch<React.SetStateAction<string>>;
};

const MyProfileAdDetailsTextArea = ({
    advertiserInfo,
    setAdvertDescription,
    setContactInfo,
}: TMYProfileAdDetailsTextAreaProps) => {
    return (
        <>
            <TextArea
                onChange={e => setContactInfo(e.target.value)}
                placeholder='My contact details'
                value={advertiserInfo?.contact_info || ''}
            />
            <TextArea
                label='This information will be visible to everyone.'
                onChange={e => setAdvertDescription(e.target.value)}
                placeholder='Instructions'
                value={advertiserInfo?.default_advert_description || ''}
            />
        </>
    );
};

const MyProfileAdDetails = () => {
    const { data: advertiserInfo, isLoading } = p2p.advertiser.useGetInfo();
    const { mutate: updateAdvertiser } = p2p.advertiser.useUpdate();
    const [contactInfo, setContactInfo] = useState('');
    const [advertDescription, setAdvertDescription] = useState('');
    const { isMobile } = useDevice();
    const { setQueryString } = useQueryString();

    const hasUpdated = useMemo(() => {
        return (
            contactInfo !== advertiserInfo?.contact_info ||
            advertDescription !== advertiserInfo?.default_advert_description
        );
    }, [advertiserInfo?.contact_info, advertiserInfo?.default_advert_description, contactInfo, advertDescription]);

    useEffect(() => {
        setContactInfo(advertiserInfo?.contact_info || '');
        setAdvertDescription(advertiserInfo?.default_advert_description || '');
    }, [advertiserInfo]);

    const submitAdDetails = () => {
        updateAdvertiser({
            contact_info: contactInfo,
            default_advert_description: advertDescription,
        });
    };

    if (isLoading) return <Loader />;

    if (isMobile) {
        return (
            <FullPageMobileWrapper
                onBack={() =>
                    setQueryString({
                        tab: 'default',
                    })
                }
                renderFooter={() => (
                    <Button disabled={!hasUpdated} isFullWidth onClick={submitAdDetails} size='lg'>
                        Save
                    </Button>
                )}
                renderHeader={() => <h1 className='p2p-v2-my-profile-ad-details__header'>Ad Details</h1>}
            >
                <div className='p2p-v2-my-profile-ad-details'>
                    <MyProfileAdDetailsTextArea
                        advertiserInfo={advertiserInfo}
                        setAdvertDescription={setAdvertDescription}
                        setContactInfo={setContactInfo}
                    />
                </div>
            </FullPageMobileWrapper>
        );
    }
    return (
        <div className='p2p-v2-my-profile-ad-details'>
            <MyProfileAdDetailsTextArea
                advertiserInfo={advertiserInfo}
                setAdvertDescription={setAdvertDescription}
                setContactInfo={setContactInfo}
            />
            <div className='p2p-v2-my-profile-ad-details__border' />
            <Button disabled={!hasUpdated} onClick={submitAdDetails} size='lg'>
                Save
            </Button>
        </div>
    );
};

export default MyProfileAdDetails;
