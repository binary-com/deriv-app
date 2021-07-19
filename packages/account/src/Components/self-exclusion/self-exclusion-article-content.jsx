import classNames from 'classnames';
import * as React from 'react';
import PropTypes from 'prop-types';
import { getStaticUrl, PlatformContext } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { Button, Icon, Popup, Text } from '@deriv/components';
import SelfExclusionContext from './self-exclusion-context';

export const selfExclusionArticleItems = ({ is_eu, is_uk, is_deriv_crypto, is_app_settings }) => {
    const getEuItems = () => {
        const eu_items = [
            {
                component: (
                    <Localize
                        i18n_default_text='These spending limits and self-exclusion help you control the amount of money and time you spend on Deriv.com and exercise <0>responsible trading</0>.'
                        components={[
                            <a
                                key={0}
                                className='link'
                                rel='noopener noreferrer'
                                target='_blank'
                                href={getStaticUrl('/responsible', { is_deriv_crypto })}
                            />,
                        ]}
                    />
                ),
            },
        ];

        if (is_uk) {
            eu_items.push({
                component: (
                    <Localize i18n_default_text='These spending limits are optional, and you can strengthen them at any time. If you don’t wish to set a specific limit, leave the field blank. If you live in the United Kingdom, Customer Support can only remove or weaken your spending limits after 24 hours of receiving the request. If you live in the Isle of Man, Customer Support can only remove or weaken your spending limits after your spending limit period has expired.' />
                ),
            });
        } else {
            eu_items.push({
                component: (
                    <Localize i18n_default_text='These spending limits are optional, and you can strengthen them at any time. If you don’t wish to set a specific limit, leave the field blank. Customer Support can only remove or weaken your spending limits after 24 hours of receiving the request.' />
                ),
            });
        }

        eu_items.push({
            component: (
                <Localize i18n_default_text='When you set your limits or self-exclusion, they will be aggregated across all your account types in DTrader and DBot. For example, the losses made on both platforms will add up and be counted towards the loss limit you set.' />
            ),
        });

        if (is_uk && !is_app_settings) {
            eu_items.push({
                component: (
                    <Localize
                        i18n_default_text='You can also exclude yourself entirely for a specified duration. This can only be removed once your self-exclusion has expired. If you wish to continue trading once your self-exclusion period expires, you must contact Customer Support by calling <0>+447723580049</0> to lift this self-exclusion. Requests by chat or email shall not be entertained. There will be a 24-hour cooling-off period before you can resume trading.'
                        components={[
                            <a
                                key={0}
                                className='link'
                                rel='noopener noreferrer'
                                target='_blank'
                                href='tel:+447723580049'
                            />,
                        ]}
                    />
                ),
            });
        } else if (!is_app_settings) {
            eu_items.push(
                {
                    component: (
                        <Localize i18n_default_text='You can also exclude yourself entirely for a specified duration. If, at any time, you decide to trade again, you must then contact our Customer Support to remove this self-exclusion. There will be a 24-hour-cooling-off period before you can resume trading. ' />
                    ),
                },
                {
                    component: (
                        <Localize
                            i18n_default_text='UK clients won’t be able to remove their self-exclusion until the set period has expired. If you wish to continue trading once your self-exclusion period expires, you must contact Customer Support by calling <0>+447723580049</0> to lift this self-exclusion. Requests by chat or email shall not be entertained. There will be a 24-hour cooling-off period before you can resume trading. '
                            components={[
                                <a
                                    key={0}
                                    className='link'
                                    rel='noopener noreferrer'
                                    target='_blank'
                                    href='tel:+447723580049'
                                />,
                            ]}
                        />
                    ),
                }
            );
        }

        return eu_items;
    };

    const getNonEuItems = () => [
        {
            component: (
                <Localize
                    i18n_default_text='These self-exclusion limits help you control the amount of money and time you spend trading on DTrader, DBot, and SmartTrader. The limits you set here will help you exercise <0>responsible trading</0>.'
                    components={[
                        <a
                            key={0}
                            className='link'
                            rel='noopener noreferrer'
                            target='_blank'
                            href={getStaticUrl('/responsible', { is_deriv_crypto })}
                        />,
                    ]}
                />
            ),
        },
        {
            component: (
                <Localize i18n_default_text='These limits are optional, and you can adjust them at any time. You decide how much and how long you’d like to trade. If you don’t wish to set a specific limit, leave the field blank.' />
            ),
        },
        {
            component: (
                <Localize i18n_default_text='When you set your limits, they will be aggregated across all your account types in DTrader, DBot, and SmartTrader. For example, the losses made on all three platforms will add up and be counted towards the loss limit you set.' />
            ),
        },
        ...(!is_app_settings
            ? [
                  {
                      component: (
                          <Localize
                              i18n_default_text='You can also exclude yourself entirely for a specified duration. Once the self-exclusion period has ended, you can either extend it further or resume trading immediately. If you wish to reduce or remove the self-exclusion period, contact our <0>Customer Support</0>.'
                              components={[
                                  <a
                                      key={0}
                                      className='link'
                                      rel='noopener noreferrer'
                                      target='_blank'
                                      href={getStaticUrl('/contact-us', { is_deriv_crypto })}
                                  />,
                              ]}
                          />
                      ),
                  },
              ]
            : []),
    ];

    const article_items = is_eu ? getEuItems() : getNonEuItems();
    return article_items.map((article_item, idx) => ({
        ...article_item,
        key: `self_exclusion_desc_${idx}`,
    }));
};

const SelfExclusionArticleContent = ({ is_in_overlay }) => {
    const { is_app_settings, toggleArticle, overlay_ref, is_eu, is_uk } = React.useContext(SelfExclusionContext);
    const { is_deriv_crypto } = React.useContext(PlatformContext);

    const keyed_article_items = selfExclusionArticleItems({ is_eu, is_uk, is_deriv_crypto, is_app_settings });
    if (is_in_overlay) {
        return (
            <Popup.Overlay
                descriptions={keyed_article_items}
                done_text={localize('Done')}
                overlay_ref={overlay_ref}
                title={localize('Spending limits')}
                toggleOverlay={toggleArticle}
            />
        );
    }

    return (
        <div
            className={classNames('da-self-exclusion-article__content', {
                'da-self-exclusion-article__content--is-in-modal': !is_in_overlay,
            })}
        >
            <div className='da-self-exclusion-article__content-header-container'>
                <Text
                    as='h3'
                    color='prominent'
                    size='s'
                    line_height='l'
                    weight='bold'
                    className='da-self-exclusion-article__content-header'
                >
                    <Localize i18n_default_text='About spending limits and self-exclusion' />
                </Text>
                <Icon icon='IcCross' className='da-self-exclusion-article__content-icon' onClick={toggleArticle} />
            </div>
            <ul className='da-self-exclusion-article__content-list'>
                {keyed_article_items.map(article => (
                    <li key={article.key}>
                        <Text as='span' size='xxs'>
                            {article.component}
                        </Text>
                    </li>
                ))}
            </ul>
            {is_app_settings && (
                <div className='da-self-exclusion-article__content-button'>
                    <Button secondary large onClick={toggleArticle}>
                        <Localize i18n_default_text='Done' />
                    </Button>
                </div>
            )}
        </div>
    );
};

SelfExclusionArticleContent.propTypes = {
    is_in_overlay: PropTypes.bool,
};

export default SelfExclusionArticleContent;
