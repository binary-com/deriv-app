import React from 'react';
import { withRouter } from 'react-router-dom';
import { AutoHeightWrapper } from '@deriv/components';
import ProofOfIdentityContainer from './proof-of-identity-container.jsx';

const ProofOfIdentity = ({ is_from_external, onStateChange }) => {
    return (
        <AutoHeightWrapper>
            {({ setRef, height }) => (
                <div ref={setRef} className='proof-of-identity'>
                    <div className='proof-of-identity__main-container'>
                        <ProofOfIdentityContainer
                            height={height}
                            is_from_external={is_from_external}
                            onStateChange={onStateChange}
                        />
                    </div>
                </div>
            )}
        </AutoHeightWrapper>
    );
};

export default withRouter(ProofOfIdentity);
