import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-[12px] border-[#dee1e6] px-4 py-3 h-[48px] shadow-sm focus:border-[#0B5EA8] focus:ring-[#0B5EA8] ' +
                className
            }
            ref={localRef}
        />
    );
});
