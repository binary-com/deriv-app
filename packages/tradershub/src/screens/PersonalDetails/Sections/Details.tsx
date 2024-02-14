import React, { Fragment, lazy, Suspense } from 'react';
import { useFormikContext } from 'formik';
import { InlineMessage, Input, Loader, Text } from '@deriv-com/ui';
import DetailsConfirmation from './DetailsConfirmation';

const ExampleImage = lazy(() => import('@/assets/svgs/personal-details-example.svg'));

const Details = () => {
    const { errors, handleBlur, handleChange, touched, values } = useFormikContext<{
        confirmation: boolean;
        dateOfBirth: string;
        firstName: string;
        lastName: string;
    }>();

    return (
        <Fragment>
            <Text as='p' className='my-16' weight='bold'>
                Details
            </Text>
            <div className='p-16 outline outline-1 outline-system-light-active-background md:mx-16 rounded-default'>
                <InlineMessage className='items-start mb-16' variant='warning'>
                    <Text as='p' className='text-sm lg:text-default'>
                        To avoid delays, enter your <span className='font-bold'>name</span> and{' '}
                        <span className='font-bold'>date of birth</span> exactly as they appear on your identity
                        document.
                    </Text>
                </InlineMessage>
                <div className='flex flex-col-reverse justify-center gap-16 md:flex-row'>
                    <div className='flex flex-col gap-20 md:w-1/2'>
                        <Input
                            className='text-sm'
                            error={Boolean(errors.firstName && touched.firstName)}
                            isFullWidth
                            label='First name*'
                            message={
                                errors.firstName && touched.firstName
                                    ? errors.firstName
                                    : 'Your first name as in your identity document'
                            }
                            name='firstName'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.firstName}
                        />
                        <Input
                            className='text-sm'
                            error={Boolean(errors.lastName && touched.lastName)}
                            isFullWidth
                            label='Last name*'
                            message={
                                errors.lastName && touched.lastName
                                    ? errors.lastName
                                    : 'Your last name as in your identity document'
                            }
                            name='lastName'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.lastName}
                        />
                        {/** Add date picker when available from deriv/ui */}
                        <Input
                            className='text-sm'
                            error={Boolean(errors.dateOfBirth && touched.dateOfBirth)}
                            isFullWidth
                            label='Date of birth*'
                            message={
                                errors.dateOfBirth && touched.dateOfBirth
                                    ? errors.dateOfBirth
                                    : 'Your last name as in your identity document'
                            }
                            name='dateOfBirth'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.dateOfBirth}
                        />
                    </div>
                    <div className='relative text-center md:w-1/2'>
                        <Text as='p' className='mt-2 mb-4' size='xs' weight='bold'>
                            Example:
                        </Text>
                        <Suspense fallback={<Loader />}>
                            <ExampleImage />
                        </Suspense>
                    </div>
                </div>
                <div className='mt-16'>
                    <DetailsConfirmation />
                </div>
            </div>
        </Fragment>
    );
};

export default Details;
