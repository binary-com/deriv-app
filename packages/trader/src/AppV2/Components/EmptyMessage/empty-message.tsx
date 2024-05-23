import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import { StandaloneBriefcaseFillIcon, StandaloneSearchFillIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';

export type TEmptyMessageProps = {
    isClosedTab?: boolean;
    noMatchesFound?: boolean;
};

const EmptyMessage = ({ isClosedTab, noMatchesFound }: TEmptyMessageProps) => {
    const Icon = noMatchesFound ? StandaloneSearchFillIcon : StandaloneBriefcaseFillIcon;

    return (
        <div className={`empty-message__${isClosedTab ? 'closed' : 'open'}`}>
            <div className='icon' data-testid='dt_empty_state_icon'>
                <Icon iconSize='2xl' fill='var(--core-color-solid-slate-200)' />
            </div>
            <div className='message'>
                {/* There is an issue with tokens: the 'lg' size should give 18px but it's giving 20px, it's being discussed. */}
                <Text bold size='lg' color='quill-typography__color--subtle'>
                    {noMatchesFound && <Localize i18n_default_text='No matches found' />}
                    {!noMatchesFound &&
                        (isClosedTab ? (
                            <Localize i18n_default_text='No closed positions' />
                        ) : (
                            <Localize i18n_default_text='No open positions' />
                        ))}
                </Text>
                <Text size='sm' centered color='quill-typography__color--subtle'>
                    {noMatchesFound && (
                        <Localize i18n_default_text='Try changing or removing filters to view available positions.' />
                    )}
                    {!noMatchesFound &&
                        (isClosedTab ? (
                            <Localize i18n_default_text='Your completed trades will appear here.' />
                        ) : (
                            <Localize i18n_default_text='Your open trades will appear here.' />
                        ))}
                </Text>
            </div>
        </div>
    );
};

export default EmptyMessage;