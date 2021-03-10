import * as React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import Blog from 'Assets/SvgComponents/header/blog.svg';
import Career from 'Assets/SvgComponents/header/careers.svg';
import Community from 'Assets/SvgComponents/header/community.svg';
import ContactUs from 'Assets/SvgComponents/header/contact-us.svg';
import HelpCentre from 'Assets/SvgComponents/header/help-centre.svg';
import OurLeadership from 'Assets/SvgComponents/header/our-leadership.svg';
import OurStory from 'Assets/SvgComponents/header/our-story.svg';
import PartnershipProgrammes from 'Assets/SvgComponents/header/partnership-programmes.svg';
import PaymentMethods from 'Assets/SvgComponents/header/payment-methods.svg';
import RegulatoryInfo from 'Assets/SvgComponents/header/regulatory-info.svg';
import WhyChooseUs from 'Assets/SvgComponents/header/why-choose-us.svg';

const getNavigationItems = type => {
    const deriv_url = 'https://deriv.com';
    if (type === 'about') {
        return [
            {
                name: <Localize i18n_default_text='Our story' />,
                to: `${deriv_url}/about/#story`,
                icon: <OurStory />,
            },
            {
                name: <Localize i18n_default_text='Our leadership' />,
                to: `${deriv_url}/about/#leadership`,
                icon: <OurLeadership />,
            },
            {
                name: <Localize i18n_default_text='Regulatory information' />,
                to: `${deriv_url}/regulatory/`,
                icon: <RegulatoryInfo />,
            },
            {
                name: <Localize i18n_default_text='Why choose us?' />,
                to: `${deriv_url}/why-choose-us/`,
                icon: <WhyChooseUs />,
            },
            {
                name: <Localize i18n_default_text='Partnership programmes' />,
                to: `${deriv_url}/partners/`,
                icon: <PartnershipProgrammes />,
            },
            {
                name: <Localize i18n_default_text='Contact us' />,
                to: `${deriv_url}/contact_us/`,
                icon: <ContactUs />,
            },
            {
                name: <Localize i18n_default_text='Careers' />,
                to: `${deriv_url}/careers/`,
                icon: <Career />,
            },
        ];
    }
    if (type === 'resources') {
        return [
            {
                name: <Localize i18n_default_text='Help centre' />,
                to: `${deriv_url}/help-centre/`,
                icon: <HelpCentre />,
            },
            {
                name: <Localize i18n_default_text='Community' />,
                to: `${deriv_url}/help-centre/`,
                icon: <Community />,
            },
            {
                name: <Localize i18n_default_text='Payment methods' />,
                to: `${deriv_url}/payment-methods/`,
                icon: <PaymentMethods />,
            },
            {
                name: <Localize i18n_default_text='Blog' />,
                to: `${deriv_url}/help-centre/`,
                icon: <Blog />,
            },
        ];
    }
    return [];
};

const HeaderDropdownItem = ({ icon, name, to }) => {
    return (
        <a href={to} className='dashboard-header-dropdown__card-link'>
            <div className='dashboard-header-dropdown__card-link__icon'>{icon}</div>
            <Text size='s'>{name}</Text>
        </a>
    );
};

const HeaderDropdown = ({ current_ref, onClickHandler, parent, setRef }) => {
    const [left_offset, setLeftOffset] = React.useState(current_ref?.offsetLeft);
    const dropdown_container_ref = React.useRef(null);

    const updateOffsets = React.useCallback(() => {
        if (current_ref) {
            setLeftOffset(current_ref.offsetLeft);
        }
    });

    React.useEffect(() => {
        if (dropdown_container_ref) {
            setRef(dropdown_container_ref);
        }
        window.addEventListener('resize', updateOffsets);
        return () => {
            window.removeEventListener('resize', updateOffsets);
        };
    }, [parent]);

    return (
        <div ref={setRef} className='dashboard-header-dropdown' style={{ left: left_offset }}>
            <div className='dashboard-header-dropdown__wrapper'>
                <div className='dashboard-header-dropdown__wrapper__card'>
                    {getNavigationItems(parent).map(item => (
                        <HeaderDropdownItem key={item.name} onClick={onClickHandler} {...item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeaderDropdown;
