import React, { lazy, Suspense } from 'react';
import { useFormikContext } from 'formik';
import { useBreakpoint } from '@deriv/quill-design';
import { InlineMessage, Input, Loader, Text } from '@deriv-com/ui';

const ExampleImage = lazy(() => import('../../../public/images/personal-details-example.svg'));

const Details = () => {
    const isMobile = useBreakpoint();
    const { errors, handleBlur, handleChange, touched, values } = useFormikContext<{
        dateOfBirth: string;
        firstName: string;
        lastName: string;
    }>();

    return (
        <>
            <Text as='p' className='my-800' weight='bold'>
                Details
            </Text>
            <div className='outline outline-1 outline-system-light-active-background md:mx-800 p-800 rounded-400 pb-2000'>
                <InlineMessage className='items-start mb-800' variant='warning'>
                    <Text size={isMobile ? 'sm' : 'md'}>
                        To avoid delays, enter your <span className='font-bold'>name</span> and{' '}
                        <span className='font-bold'>date of birth</span> exactly as they appear on your identity
                        document.
                    </Text>
                </InlineMessage>
                <div className='flex flex-col-reverse justify-center md:flex-row gap-800'>
                    <div className='flex flex-col md:w-1/2 gap-2000'>
                        <Input
                            className='w-full text-body-md'
                            error={Boolean(errors.firstName && touched.firstName)}
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
                            className='w-full text-body-sm'
                            error={Boolean(errors.lastName && touched.lastName)}
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
                            className='w-full text-body-sm'
                            error={Boolean(errors.dateOfBirth && touched.dateOfBirth)}
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
                    {/** Add confirmation checkbox for the confirmation when available in deriv/ui */}
                </div>
            </div>
        </>
    );
};

export default Details;
