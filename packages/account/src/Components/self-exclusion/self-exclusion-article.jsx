import * as React from 'react';
import { StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { PlatformContext, isDesktop, isMobile } from '@deriv/shared';
import AccountArticle from 'Components/article/article.jsx';
import { selfExclusionArticleItems } from 'Components/self-exclusion/self-exclusion-article-content.jsx';
import SelfExclusionContext from './self-exclusion-context';

const SelfExclusionArticle = () => {
    const { is_app_settings, toggleArticle, is_eu, is_uk } = React.useContext(SelfExclusionContext);
    const { is_deriv_crypto } = React.useContext(PlatformContext);
    const { is_dashboard } = React.useContext(PlatformContext);
    return (
        <AccountArticle
            title={localize('About spending limits and self-exclusion')}
            descriptions={
                is_dashboard && isDesktop()
                    ? selfExclusionArticleItems({ is_eu, is_uk, is_deriv_crypto, is_app_settings })
                    : [
                          is_eu ? (
                              <Localize
                                  i18n_default_text='Spending limit and self-exclusion help you control the amount of money and time you spend trading on DTrader, DBot, and SmartTrader. The limits you set here will help you exercise <0>responsible trading</0>.'
                                  components={[<StaticUrl key={0} className='link' href='/responsible' />]}
                              />
                          ) : (
                              <Localize
                                  i18n_default_text='These self-exclusion limits help you control the amount of money and time you spend trading on DTrader, DBot, and SmartTrader. The limits you set here will help you exercise <0>responsible trading</0>.'
                                  components={[<StaticUrl key={0} className='link' href='/responsible' />]}
                              />
                          ),
                      ]
            }
            {...((!is_dashboard || isMobile()) && { onClickLearnMore: toggleArticle })}
        />
    );
};

export default SelfExclusionArticle;
