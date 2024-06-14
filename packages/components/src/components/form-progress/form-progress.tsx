import React from 'react';
import classNames from 'classnames';
import Text from '../text';
import DesktopWrapper from '../desktop-wrapper';
import MobileOrTabletWrapper from '../mobile-wrapper';

type TStep = { header: { active_title: string; title: string }; sub_step_count: number };

type TFormProgress = {
    steps: TStep[];
    current_step: number;
    sub_section_index: number;
};

const FormProgress = ({ steps = [], current_step, sub_section_index }: TFormProgress) => {
    React.useEffect(() => {
        animateCompleteBar();
    });

    const el_completed_bar = React.useRef<HTMLDivElement | null>(null);

    const animateCompleteBar = () => {
        const sub_steps_count = steps[current_step]?.sub_step_count || null;
        const el_first_identifier = (document.querySelector('.identifier') as HTMLSpanElement) || {
            offsetLeft: 0,
            clientWidth: 1,
        };
        const each = 100 / steps.length;
        const sub_divisions = sub_steps_count ? Math.ceil(each / sub_steps_count) : 0;
        if (el_completed_bar.current) {
            el_completed_bar.current.style.width = `${current_step * each + sub_section_index * sub_divisions}%`;
            el_completed_bar.current.style.transform = `translateX(${
                el_first_identifier.offsetLeft + el_first_identifier.clientWidth / 2
            }px)`;
        }
    };

    let active = false;

    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='dc-form-progress'>
                    <div className='dc-form-progress__header'>
                        <Text as='h2' color='prominent' weight='bold' line_height='unset'>
                            {steps[current_step].header.active_title}
                        </Text>
                        <div className='dc-form-progress__steps'>
                            <div
                                className='dc-form-progress__steps--before'
                                style={{
                                    width: `calc(100% * ${steps.length - 1} / ${steps.length})`,
                                }}
                            />
                            {steps.map((item, idx) => (
                                <React.Fragment key={item.header.title}>
                                    {(active = idx === current_step)}
                                    <div className='dc-form-progress__step'>
                                        <Text
                                            align='center'
                                            size='xs'
                                            weight='bold'
                                            color='colored-background'
                                            className={classNames('identifier', {
                                                'identifier--active': idx <= current_step,
                                            })}
                                        >
                                            {idx + 1}
                                        </Text>
                                        <Text
                                            as='p'
                                            align='center'
                                            size='xxs'
                                            weight={active ? 'bold' : 'unset'}
                                            color={active ? 'loss-danger' : 'prominent'}
                                        >
                                            {item.header.title}
                                        </Text>
                                    </div>
                                </React.Fragment>
                            ))}
                            <div ref={el_completed_bar} className='dc-form-progress__steps--after' />
                        </div>
                    </div>
                </div>
            </DesktopWrapper>
            <MobileOrTabletWrapper>
                <div>
                    <div ref={el_completed_bar} className='dc-form-progress__steps--after' />
                    <div className='dc-form-progress--initial' />
                </div>
            </MobileOrTabletWrapper>
        </React.Fragment>
    );
};

export default React.memo(FormProgress);
