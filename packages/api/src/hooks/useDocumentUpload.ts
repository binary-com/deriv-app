import { useCallback, useMemo, useState } from 'react';
import useMutation from '../useMutation';
import { compressImageFile, generateChunks, numToUint8Array, readFile } from '../utils';
import md5 from 'md5';
import { useAPIContext } from '../APIProvider';

type TDocumentUploadPayload = Parameters<ReturnType<typeof useMutation<'document_upload'>>['mutate']>[0]['payload'];
type TUploadPayload = Omit<TDocumentUploadPayload, 'document_format' | 'expected_checksum' | 'file_size'> & {
    file?: File;
};

/** A custom hook to handle document file uploads to our backend. */
const useDocumentUpload = () => {
    const {
        data,
        isLoading: _isLoading,
        isSuccess: _isSuccess,
        mutateAsync,
        status,
        ...rest
    } = useMutation('document_upload');
    const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);
    const [documentUploadStatus, setDocumentUploadStatus] = useState('');
    const { derivAPI } = useAPIContext();

    const isLoading = _isLoading || (!isDocumentUploaded && status === 'success');
    const isSuccess = _isSuccess && isDocumentUploaded;

    const upload = useCallback(
        async (payload: TUploadPayload) => {
            if (!payload?.file) return Promise.reject(new Error('No file selected'));
            const file = payload.file;
            delete payload.file;
            const fileBlob = await compressImageFile(file);
            const modifiedFile = await readFile(fileBlob);
            // @ts-expect-error type mismatch
            const fileBuffer = new Uint8Array(modifiedFile.buffer);
            const checksum = md5(Array.from(fileBuffer));

            const updatedPayload = {
                ...payload,
                document_format: file.type
                    .split('/')[1]
                    .toLocaleUpperCase() as TDocumentUploadPayload['document_format'],
                expected_checksum: checksum,
                file_size: fileBuffer.length,
                passthrough: {
                    document_upload: true,
                },
            };
            setIsDocumentUploaded(false);
            await mutateAsync({ payload: updatedPayload }).then(async res => {
                const chunks = generateChunks(fileBuffer, {});
                const id = numToUint8Array(res?.document_upload?.upload_id || 0);
                const type = numToUint8Array(res?.document_upload?.call_type || 0);

                chunks.forEach(chunk => {
                    const size = numToUint8Array(chunk.length);
                    const payload = new Uint8Array([...type, ...id, ...size, ...chunk]);
                    derivAPI.connection.send(payload);
                });

                const timeout = setTimeout(() => {
                    derivAPI.connection?.removeEventListener('message', handleUploadStatus);
                }, 20000);

                const handleUploadStatus = (messageEvent: MessageEvent) => {
                    const data = JSON.parse(messageEvent.data);

                    if (data.error) {
                        derivAPI.connection?.removeEventListener('message', handleUploadStatus);
                        setDocumentUploadStatus('error');
                        clearTimeout(timeout);
                        return;
                    }

                    if (data.document_upload && data.document_upload?.status === 'failure') {
                        derivAPI.connection?.removeEventListener('message', handleUploadStatus);
                        setDocumentUploadStatus('failure');
                        clearTimeout(timeout);
                        return;
                    }

                    if (data.document_upload && data.document_upload?.status === 'success') {
                        derivAPI.connection?.removeEventListener('message', handleUploadStatus);
                        setDocumentUploadStatus('success');
                        clearTimeout(timeout);
                    }
                };

                derivAPI.connection?.addEventListener('message', handleUploadStatus);

                setIsDocumentUploaded(true);
            });
        },
        [derivAPI, derivAPI.connection, mutateAsync]
    );

    const modified_response = useMemo(() => ({ ...data?.document_upload }), [data?.document_upload]);

    return {
        /** The upload response */
        data: modified_response,
        /** Function to upload the document */
        upload,
        /** Mutation status */
        status,
        /** Whether the mutation is loading */
        isLoading,
        /** Whether the mutation is successful */
        isSuccess,
        documentUploadStatus,
        ...rest,
    };
};

export default useDocumentUpload;
