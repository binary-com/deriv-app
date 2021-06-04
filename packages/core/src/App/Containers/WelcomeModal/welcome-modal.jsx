import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Modal, Carousel, Icon, Button, ThemedScrollbars, Text } from '@deriv/components';
import { routes, isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const WelcomeColumn = ({
    className,
    description,
    footer_text,
    icons,
    onMouseEnter,
    onMouseLeave,
    platforms,
    title,
}) => {
    return (
        <div
            className={classNames('welcome-column', className)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className='welcome-column__icons'>
                {icons.map((icon, index) => (
                    <Icon className='welcome-column__icon' icon={icon} key={index} size={48} />
                ))}
            </div>
            <div className='welcome-column__title'>{title}</div>
            <div className='welcome-column__description'>{description}</div>
            <div className='welcome-column__platforms'>
                <Text
                    as='p'
                    color='prominent'
                    weight='bold'
                    size='xs'
                    className='welcome-column__platforms__title'
                    align={isMobile() ? 'center' : ''}
                >
                    {localize('Platforms')}
                </Text>
                <div className='welcome-column__platforms__container'>
                    {platforms.map((platform, index) => (
                        <React.Fragment key={index}>
                            <div className='welcome-column__platform'>
                                <Icon className='welcome-column__platform__icon' icon={platform.icon} size={32} />
                                <Text
                                    as='h3'
                                    weight='bold'
                                    align='center'
                                    color='prominent'
                                    size='xs'
                                    className='welcome-column__platform__title'
                                >
                                    {platform.title}
                                </Text>
                                <Text
                                    as='p'
                                    color='less-prominent'
                                    size='xxs'
                                    align='left'
                                    className='welcome-column__platform__description'
                                >
                                    {platform.description}
                                </Text>
                            </div>
                            <div
                                className={classNames('welcome-column__platform-footer', {
                                    'welcome-column__platform-footer--has-separator': index === 0,
                                })}
                            >
                                <Button
                                    className='welcome-column__platform-button'
                                    onClick={platform.onButtonClick}
                                    secondary
                                    large
                                >
                                    {platform.button_text}
                                </Button>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <div className='welcome-column__footer'>
                {footer_text && (
                    <Text as='p' size='xxs' color='less-prominent' className='welcome-column__footer__text'>
                        {footer_text}
                    </Text>
                )}
            </div>
        </div>
    );
};

const footer_text = localize('You can switch between CFDs, digital options, and multipliers at any time.');

WelcomeColumn.propTypes = {
    description: PropTypes.string,
    icons: PropTypes.array,
    platforms: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string,
};

const WelcomeModal = ({ toggleWelcomeModal, history, is_dxtrade_allowed }) => {
    const [hovered, setHovered] = React.useState(null);
    const [column_width, setColumnWidth] = React.useState(320);
    const carouselRef = React.useRef(null);
    const switchPlatform = React.useCallback(
        route => {
            toggleWelcomeModal({ is_visible: false, should_persist: true });
            history.push(route);
        },
        [toggleWelcomeModal, history]
    );

    React.useEffect(() => {
        setColumnWidth(carouselRef.current.offsetWidth);
    }, [carouselRef]);

    const getLeftPlatforms = () => {
        const platforms = [
            {
                icon: 'IcBrandDmt5',
                title: localize('DMT5'),
                description: localize(
                    'Trade on Deriv MetaTrader 5 (DMT5), the all-in-one FX and CFD trading platform.'
                ),
                onButtonClick: () => switchPlatform(routes.mt5),
                button_text: localize('Trade on MT5'),
            },
        ];

        if (is_dxtrade_allowed) {
            platforms.push({
                icon: 'IcBrandDxtrade',
                title: localize('Deriv X'),
                description: localize('Trade FX and CFDs on a customisable, easy-to-use trading platform.'),
                onButtonClick: () => switchPlatform(routes.dxtrade),
                button_text: localize('Trade on Deriv X'),
            });
        }
        return platforms;
    };

    const Cards = [
        <WelcomeColumn
            key={0}
            className='welcome-column--left'
            description={localize('Trade with leverage and low spreads for better returns on successful trades.')}
            icons={['IcPercentSolid']}
            is_hovered={hovered === 'left'}
            platforms={getLeftPlatforms()}
            title={localize('CFDs')}
            onMouseEnter={() => {
                setHovered('left');
            }}
            onMouseLeave={() => {
                setHovered(null);
            }}
            footer_text={footer_text}
        />,
        <WelcomeColumn
            key={1}
            className='welcome-column--right'
            description={localize(
                'Earn fixed payouts with options, or trade multipliers to amplify your gains with limited risk.'
            )}
            icons={['IcUpDownSolid', 'IcCrossSolid']}
            is_hovered={hovered === 'right'}
            onButtonClick={() => switchPlatform(routes.trade)}
            platforms={[
                {
                    icon: 'IcBrandDtrader',
                    title: localize('DTrader'),
                    description: localize('Our flagship options and multipliers trading platform.'),
                    onButtonClick: () => switchPlatform(routes.trade),
                    button_text: localize('Trade on DTrader'),
                },
                {
                    icon: 'IcBrandDbot',
                    title: localize('DBot'),
                    description: localize('Automate your trading, no coding needed.'),
                    onButtonClick: () => switchPlatform(routes.bot),
                    button_text: localize('Trade on DBot'),
                },
            ]}
            title={localize('Options & Multipliers')}
            onMouseEnter={() => {
                setHovered('right');
            }}
            onMouseLeave={() => {
                setHovered(null);
            }}
            footer_text={footer_text}
        />,
    ];

    return (
        <Modal width='760px' className='welcome' is_open={true} has_close_icon={false} has_outer_content={true}>
            <ThemedScrollbars height={700}>
                <Text as='h2' weight='bold' align='center' color='prominent' className='welcome__title'>
                    {localize('Where would you like to start?')}
                </Text>
                <div
                    className={classNames('welcome__message', 'welcome__message--left', {
                        'welcome__message--visible': hovered === 'left',
                    })}
                >
                    <Text
                        as='p'
                        color='colored-background'
                        weight='bold'
                        align='left'
                        className='welcome__message__text'
                    >
                        {localize("If you're looking for CFDs")}
                    </Text>
                    <Icon icon='IcArrowRightCurly' size={43} />
                </div>
                <div
                    className={classNames('welcome__message', 'welcome__message--right', {
                        'welcome__message--visible': hovered === 'right',
                    })}
                >
                    <Icon icon='IcArrowLeftCurly' size={43} />
                    <Text
                        as='p'
                        color='colored-background'
                        weight='bold'
                        align='left'
                        className='welcome__message__text'
                    >
                        {localize('Not sure? Try this')}
                    </Text>
                </div>
                <div className='welcome__body' ref={carouselRef}>
                    {isMobile() ? (
                        <Carousel show_nav={false} list={Cards} width={column_width} className='welcome__carousel' />
                    ) : (
                        Cards
                    )}
                </div>
                <Text as='p' size='xxs' color='less-prominent' className='welcome__footer'>
                    {footer_text}
                </Text>
            </ThemedScrollbars>
        </Modal>
    );
};

export default withRouter(
    connect(({ ui, client }) => ({
        toggleWelcomeModal: ui.toggleWelcomeModal,
        is_dxtrade_allowed: client.is_dxtrade_allowed,
    }))(WelcomeModal)
);
