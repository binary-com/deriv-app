import React from 'react';
import { AutoHeightWrapper } from '@deriv/components';
import ProofOfIdentityContainer from './proof-of-identity-container.jsx';

const ProofOfIdentity = () => {
    return (
        <AutoHeightWrapper default_height={200}>
            {({ setRef, height }) => (
                <div ref={setRef} className='proof-of-identity'>
                    <div className='proof-of-identity__main-container'>
                        <ProofOfIdentityContainer height={height} is_description_enabled />
                    </div>
                </div>
            )}
        </AutoHeightWrapper>
    );
};

export default ProofOfIdentity;
