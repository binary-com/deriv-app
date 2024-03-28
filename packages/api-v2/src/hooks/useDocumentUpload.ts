import { useCallback, useMemo, useState } from 'react';
import useMutation from '../useMutation';
import { compressImageFile, generateChunks, numToUint8Array, readFile } from '../utils';
import md5 from 'md5';
import useAPI from '../useAPI';

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

    const { derivAPI } = useAPI();

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
                    derivAPI?.connection?.send(payload);
                });
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
        ...rest,
    };
};

export default useDocumentUpload;
