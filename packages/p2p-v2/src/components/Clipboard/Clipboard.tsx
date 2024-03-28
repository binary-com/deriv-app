//TODO: to be replaced with derivcom component
import React, { useEffect, useRef, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { Tooltip } from '@deriv-com/ui';
import CheckmarkCircle from '../../public/ic-checkmark-circle.svg';
import CopyIcon from '../../public/ic-clipboard.svg';
import './Clipboard.scss';

type TClipboardProps = {
    textCopy: string;
};

const Clipboard = ({ textCopy }: TClipboardProps) => {
    const timeoutClipboardRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [, copy] = useCopyToClipboard();
    const [isCopied, setIsCopied] = useState(false);

    const onClick = (event: { stopPropagation: () => void }) => {
        setIsCopied(true);
        copy(textCopy);
        timeoutClipboardRef.current = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
        event.stopPropagation();
    };

    useEffect(() => {
        return () => {
            if (timeoutClipboardRef.current) {
                clearTimeout(timeoutClipboardRef.current);
            }
        };
    }, []);

    return (
        <Tooltip message={isCopied ? 'Copied!' : 'Copy'} position='top'>
            <button className='p2p-v2-clipboard' onClick={onClick}>
                {isCopied ? <CheckmarkCircle /> : <CopyIcon />}
            </button>
        </Tooltip>
    );
};

export default Clipboard;
