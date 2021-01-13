import React from 'react';
import { Loading, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import Submitted from 'Components/poa-submitted';
import Details from './details.jsx';

const ACTIONS = {
    ADD_FILE: 'ADD_FILE',
    REMOVE_FILE: 'REMOVE_FILE',
};

const STATUS = {
    is_uploading: 'is_uploading',
    is_completed: 'is_completed',
};

const reducerFiles = (state, { type, payload }) => {
    const target_index = state.findIndex(el => el.step === payload);

    switch (type) {
        case ACTIONS.ADD_FILE:
            return [...state, payload];
        case ACTIONS.REMOVE_FILE:
            return [...state.slice(0, target_index), ...state.slice(target_index + 1)];
        default:
            return state;
    }
};

const getActiveStep = (files, steps) => {
    let active_step = null;
    if (!files.length) {
        return 0;
    }
    const confirmed_steps = files.map(file => {
        return file.step;
    });

    steps.forEach((step, index) => {
        if (active_step === null && !confirmed_steps.includes(index)) {
            active_step = index;
        }
    });
    return active_step;
};

const DetailComponent = ({ steps, onClickBack, root_class }) => {
    const [status, setStatus] = React.useState();
    const [file_list, dispatchFileList] = React.useReducer(reducerFiles, []);
    const active_step = getActiveStep(file_list, steps);
    const is_last_step = steps.length === active_step + 1;

    const onConfirm = (data, callback) => {
        if (is_last_step) {
            onComplete([...file_list, data]);
        } else {
            dispatchFileList({ type: ACTIONS.ADD_FILE, payload: data });
            callback();
        }
    };

    const onComplete = () => {
        // console.log(files);
        setStatus(STATUS.is_uploading);
        setTimeout(() => {
            setStatus(STATUS.is_completed);
        }, 3000);
    };

    const removeImagePreview = index => dispatchFileList({ type: ACTIONS.REMOVE_FILE, payload: index });

    switch (status) {
        case STATUS.is_uploading:
            return <Loading is_fullscreen={false} is_slow_loading status={[localize('Uploading documents')]} />;
        case STATUS.is_completed:
            return <Submitted />;
        default:
            return (
                <div className={`${root_class}__detail`}>
                    <div className={`${root_class}__detail-header`} onClick={onClickBack}>
                        <Icon icon='IcArrowLeftBold' />
                        <Text as='p' size='xs' weight='bold' color='prominent' className={`${root_class}__back-title`}>
                            {localize('Back')}
                        </Text>
                    </div>
                    <div className={`${root_class}__preview-name-container`}>
                        {file_list.map((item, index) => {
                            return (
                                <div key={item.file.name} className={`${root_class}__preview-name`}>
                                    <Text size='xxxs' color='less-prominent' weight='bold'>
                                        {item.file.name}
                                    </Text>
                                    <Icon icon='IcCloseCircle' onClick={() => removeImagePreview(index)} />
                                </div>
                            );
                        })}
                    </div>
                    <div className={`${root_class}__detail-grid`}>
                        <Details
                            step={steps[active_step]}
                            active_step={active_step}
                            onConfirm={onConfirm}
                            root_class={root_class}
                        />
                    </div>
                </div>
            );
    }
};

export default DetailComponent;
