import { cva } from 'class-variance-authority';

const stepperBaseStyles =
    'z-10 box-border flex h-800 w-800 items-center rounded-pill outline outline-2 transition-all delay-700 duration-700 ease-out ';

export const stepperVariants = cva(stepperBaseStyles, {
    compoundVariants: [
        {
            class: 'bg-solid-grey-5',
            isActive: false,
            isFilled: true,
        },
        {
            class: 'bg-solid-coral-700',
            isActive: true,
            isFilled: true,
        },
    ],
    variants: {
        isActive: {
            false: 'outline-solid-grey-5',
            true: 'outline-solid-coral-700',
        },
        isFilled: {
            true: '',
        },
    },
});

export const desktopStyle = {
    connector:
        'lg:h-2000 lg:w-100 lg:bg-[length:100%_200%] lg:bg-bottom lg:bg-gradient-to-b lg:aria-[current=true]:bg-top',
    stepper: 'lg:flex lg:w-fit lg:items-end lg:gap-gap-lg',
};

export const mobileStyle = {
    connector: 'bg-[length:200%_100%] bg-right bg-gradient-to-r aria-[current=true]:bg-left w-auto h-general-2xs',
};
