import React from 'react';
import classNames from 'classnames';
import { isDesktop, isMobile } from '@deriv/shared';
import { Div100vhContainer, ThemedScrollbars } from '@deriv/components';
import SelfExclusionArticle from './self-exclusion-article';
import SelfExclusionContext from './self-exclusion-context';

const SelfExclusionWrapper = ({ children }: { children?: React.ReactNode }) => {
    const { is_app_settings, is_wrapper_bypassed, state } = React.useContext(SelfExclusionContext);

    // "is_wrapper_bypassed" is currently used for a <AppSettings> hosted <SelfExclusion>.
    // It only features the <SelfExclusionArticle> for mobile views, as the <AppSettings> footer
    // has a link rather than <SelfExclusionArticle> to view the <SelfExclusionArticleContent>.
    if (is_wrapper_bypassed) {
        return (
            <section
                role='section-self-exclusion-wrapper'
                className={classNames('da-self-exclusion', {
                    'da-self-exclusion--app-settings': is_app_settings,
                })}
            >
                {isMobile() && <SelfExclusionArticle />}
                {children}
            </section>
        );
    }

    return (
        <Div100vhContainer
            className={classNames('da-self-exclusion__wrapper', {
                'da-self-exclusion__wrapper--show-article': state?.show_article,
            })}
            is_disabled={isDesktop()}
            height_offset='80px'
        >
            <ThemedScrollbars className='da-self-exclusion__scrollbars' is_bypassed={isMobile()}>
                {isMobile() && <SelfExclusionArticle />}
                {children}
            </ThemedScrollbars>
            {isDesktop() && <SelfExclusionArticle />}
        </Div100vhContainer>
    );
};

export default SelfExclusionWrapper;
