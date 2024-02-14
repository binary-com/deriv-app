import { cva, VariantProps } from 'class-variance-authority';
import { ExcludeAllNull } from '@deriv/quill-design';

export const ModalFooterClass = cva(
    'grid gap-8 p-16 border border-solid border-t-2 border-system-light-secondary-background bottom-0 lg:items-center lg:px-24 lg:py-16',
    {
        variants: {
            align: {
                center: 'lg:justify-center',
                left: 'lg:justify-start',
                right: 'lg:justify-end',
            },
        },
    }
);

export type TModalFooterClass = ExcludeAllNull<VariantProps<typeof ModalFooterClass>>;
