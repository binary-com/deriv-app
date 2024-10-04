import { useState, useEffect } from 'react';

type Status = 'idle' | 'loading' | 'ready' | 'error';

const cachedScripts: { [key: string]: Status } = {};

export const useScript = (src: string): Status => {
    const [status, setStatus] = useState<Status>(() => {
        if (!src) {
            return 'idle';
        }
        return cachedScripts[src] || 'idle';
    });

    useEffect(() => {
        if (!src) {
            setStatus('idle');
            return;
        }

        // If the script is already cached, set its status
        if (cachedScripts[src] === 'ready') {
            setStatus('ready');
            return;
        }

        // If the script is already in the process of loading, listen for its load event
        const existingScript = document.querySelector(`script[src="${src}"]`);

        if (existingScript) {
            if (existingScript.getAttribute('data-status') === 'ready') {
                cachedScripts[src] = 'ready';
                setStatus('ready');
            } else {
                setStatus('loading');

                const onScriptLoad = () => {
                    cachedScripts[src] = 'ready';
                    setStatus('ready');
                };

                const onScriptError = () => {
                    cachedScripts[src] = 'error';
                    setStatus('error');
                };

                existingScript.addEventListener('load', onScriptLoad);
                existingScript.addEventListener('error', onScriptError);

                return () => {
                    existingScript.removeEventListener('load', onScriptLoad);
                    existingScript.removeEventListener('error', onScriptError);
                };
            }
        } else {
            // Create script
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.setAttribute('data-status', 'loading');
            cachedScripts[src] = 'loading';
            setStatus('loading');

            // Define event handlers
            const onScriptLoad = () => {
                script.setAttribute('data-status', 'ready');
                cachedScripts[src] = 'ready';
                setStatus('ready');
            };

            const onScriptError = () => {
                script.setAttribute('data-status', 'error');
                cachedScripts[src] = 'error';
                setStatus('error');
            };

            script.addEventListener('load', onScriptLoad);
            script.addEventListener('error', onScriptError);

            // Add script to document
            document.body.appendChild(script);

            // Cleanup
            return () => {
                script.removeEventListener('load', onScriptLoad);
                script.removeEventListener('error', onScriptError);
            };
        }
    }, [src]);

    return status;
};
