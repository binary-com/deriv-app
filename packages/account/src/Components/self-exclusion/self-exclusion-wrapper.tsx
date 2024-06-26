import React from 'react';
import clsx from 'clsx';
import { Div100vhContainer, ThemedScrollbars } from '@deriv/components';
import SelfExclusionArticle from './self-exclusion-article';
import SelfExclusionContext from './self-exclusion-context';
import { useDevice } from '@deriv-com/ui';

const SelfExclusionWrapper = ({ children }: { children?: React.ReactNode }) => {
    const { is_app_settings, is_wrapper_bypassed, state } = React.useContext(SelfExclusionContext);
    const { isDesktop } = useDevice();

    // "is_wrapper_bypassed" is currently used for a <AppSettings> hosted <SelfExclusion>.
    // It only features the <SelfExclusionArticle> for mobile views, as the <AppSettings> footer
    // has a link rather than <SelfExclusionArticle> to view the <SelfExclusionArticleContent>.
    if (is_wrapper_bypassed) {
        return (
            <section
                role='section-self-exclusion-wrapper'
                className={clsx('da-self-exclusion', {
                    'da-self-exclusion--app-settings': is_app_settings,
                })}
            >
                {!isDesktop && <SelfExclusionArticle />}
                {children}
            </section>
        );
    }

    return (
        <Div100vhContainer
            className={clsx('da-self-exclusion__wrapper', {
                'da-self-exclusion__wrapper--show-article': state?.show_article,
            })}
            is_disabled={isDesktop}
            height_offset='80px'
        >
            <ThemedScrollbars className='da-self-exclusion__scrollbars' is_bypassed={!isDesktop}>
                {!isDesktop && <SelfExclusionArticle />}
                {children}
            </ThemedScrollbars>
            {isDesktop && <SelfExclusionArticle />}
        </Div100vhContainer>
    );
};

export default SelfExclusionWrapper;
