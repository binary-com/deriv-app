import React, {
    ComponentProps,
    DetailedHTMLProps,
    InputHTMLAttributes,
    MouseEventHandler,
    ReactNode,
    RefObject,
    useCallback,
    useEffect,
    useState,
} from 'react';
import classNames from 'classnames';
import { useDropzone } from 'react-dropzone';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Button, Text } from '@deriv-com/ui';
import DropzoneFrame from '../../assets/dropzone/dropzone-frame.svg';
import { IconButton } from '../IconButton';
import './Dropzone.scss';

type TProps = {
    buttonText?: ReactNode;
    className?: string;
    defaultFile?: File;
    description?: ReactNode;
    descriptionColor?: ComponentProps<typeof Text>['color'];
    descriptionSize?: ComponentProps<typeof Text>['size'];
    fileFormats?: NonNullable<Parameters<typeof useDropzone>[0]>['accept'];
    hasFrame?: boolean;
    hoverMessage?: ReactNode;
    icon: ReactNode;
    maxSize?: NonNullable<Parameters<typeof useDropzone>[0]>['maxSize'];
    onFileChange?: (file: File) => void;
    title?: ReactNode;
    titleType?: ComponentProps<typeof Text>['weight'];
};

type TFile = {
    file: File;
    name: string;
    preview: string;
};

// TODO: Move this component to @deriv-com/ui
const Dropzone: React.FC<TProps> = ({
    buttonText,
    className,
    defaultFile,
    description,
    descriptionColor = 'general',
    descriptionSize = 'md',
    fileFormats,
    hasFrame = false,
    hoverMessage = 'Drop file here',
    icon,
    maxSize,
    onFileChange,
    title = '',
    titleType = 'normal',
}) => {
    const [file, setFile] = useState<TFile | null>(
        defaultFile ? { file: defaultFile, name: defaultFile.name, preview: URL.createObjectURL(defaultFile) } : null
    );
    const [showHoverMessage, setShowHoverMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { getInputProps, getRootProps, open, rootRef } = useDropzone({
        accept: fileFormats,
        maxSize,
        multiple: false,
        noClick: !!buttonText,
        onDragEnter: () => setShowHoverMessage(true),
        onDragLeave: () => setShowHoverMessage(false),
        onDrop: acceptedFiles => {
            setShowHoverMessage(false);
            const acceptedFile = acceptedFiles?.[0];
            if (acceptedFile) {
                setFile({
                    file: acceptedFile,
                    name: acceptedFile.name,
                    preview: URL.createObjectURL(acceptedFile),
                });
            }
        },
        onDropAccepted() {
            setErrorMessage(null);
        },
        onDropRejected(fileRejections) {
            setErrorMessage(fileRejections?.[0]?.errors?.[0].message);
        },
    });

    useEffect(() => {
        if (file && onFileChange) {
            onFileChange(file.file);
        }
    }, [file]); // eslint-disable-line react-hooks/exhaustive-deps

    const removeFile: MouseEventHandler<HTMLButtonElement> = useCallback(event => {
        event.stopPropagation();
        setFile(null);
    }, []);

    return (
        <div {...getRootProps()} className={className} ref={rootRef as RefObject<HTMLDivElement>}>
            <input
                {...(getInputProps() as DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>)}
                data-testid='dt_dropzone_input'
            />
            <div
                className={classNames(
                    'account-dropzone',
                    { 'account-dropzone--hover': showHoverMessage },
                    { 'account-dropzone--active': file }
                )}
            >
                <div className='flex flex-col items-center justify-center w-full h-full'>
                    {showHoverMessage && <Text size='sm'>{hoverMessage}</Text>}
                    {!file ? (
                        <div className='flex flex-col items-center'>
                            <div className='flex-shrink-0 mb-24'>{icon}</div>
                            {title && (
                                <Text align='center' color='primary' size='xs' weight={titleType}>
                                    {title}
                                </Text>
                            )}
                            <Text align='center' color={descriptionColor} size={descriptionSize}>
                                {description}
                            </Text>
                            {buttonText && (
                                <div className='flex flex-col items-center gap-1600 mt-32'>
                                    <Button color='black' onClick={open} type='button' variant='outlined'>
                                        {buttonText}
                                    </Button>
                                </div>
                            )}
                            {errorMessage && (
                                <Text align='center' color='red' size='2xs'>
                                    {errorMessage}
                                </Text>
                            )}
                        </div>
                    ) : (
                        <React.Fragment key={file.name}>
                            <div
                                className={classNames('account-dropzone__thumb', {
                                    'account-dropzone__thumb--has-frame': hasFrame,
                                })}
                                data-testid='dt_remove_button'
                                style={{ backgroundImage: `url(${file.preview})` }}
                            >
                                {hasFrame && <DropzoneFrame />}
                                <IconButton
                                    className='absolute top-400 right-400 rounded-pill'
                                    color='black'
                                    data-testid='dt_remove_button_icon'
                                    icon={<StandaloneXmarkBoldIcon className='fill-solid-slate-50' iconSize='sm' />}
                                    isRound
                                    onClick={removeFile}
                                    size='sm'
                                />
                            </div>
                            {description && (
                                <Text align='center' color={descriptionColor}>
                                    {description}
                                </Text>
                            )}
                        </React.Fragment>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dropzone;
