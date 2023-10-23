import React from 'react';
import { localize } from '@deriv/translations';
import { useStore } from '@deriv/stores';
import { getDescriptionVideoUrl } from 'Modules/Trading/Helpers/contract-type';

type TContractTypeDescriptionVideo = {
    selected_contract_type?: string;
    data_testid?: string;
};

const ContractTypeDescriptionVideo = ({ selected_contract_type, data_testid }: TContractTypeDescriptionVideo) => {
    const { ui } = useStore();
    const { is_dark_mode_on: is_dark_theme, is_mobile } = ui;
    if (!selected_contract_type) {
        return null;
    }
    return (
        <video
            autoPlay
            loop
            playsInline
            disablePictureInPicture
            controlsList='nodownload'
            onContextMenu={e => e.preventDefault()}
            preload='auto'
            controls
            width={is_mobile ? 328 : 480}
            height={is_mobile ? 184.5 : 270}
            className='contract-type-info__video'
            data-testid={data_testid}
        >
            {/* a browser will select a source with extension it recognizes */}
            <source src={getDescriptionVideoUrl(selected_contract_type, is_dark_theme, 'mp4')} type='video/mp4' />
            <source src={getDescriptionVideoUrl(selected_contract_type, is_dark_theme, 'webm')} type='video/webm' />
            {localize('Unfortunately, your browser does not support the video.')}
        </video>
    );
};

export default React.memo(ContractTypeDescriptionVideo);
