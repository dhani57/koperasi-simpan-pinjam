import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export default forwardRef(function CurrencyInput(
    { className = '', isFocused = false, value, onChange, ...props },
    ref,
) {
    const localRef = useRef(null);
    const [displayValue, setDisplayValue] = useState('');

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    useEffect(() => {
        if (value !== undefined && value !== null) {
            // Remove non-digits
            const stringValue = String(value).replace(/\D/g, '');
            if (stringValue) {
                // Format with dot separator
                setDisplayValue(stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
            } else {
                setDisplayValue('');
            }
        } else {
            setDisplayValue('');
        }
    }, [value]);

    const handleChange = (e) => {
        let val = e.target.value;
        // Remove everything except numbers
        val = val.replace(/\D/g, '');
        
        // Call the original onChange with the unformatted numeric string
        if (onChange) {
            onChange({
                ...e,
                target: {
                    ...e.target,
                    value: val,
                    name: props.name,
                    id: props.id,
                },
            });
        }
    };

    return (
        <input
            {...props}
            type="text"
            inputMode="numeric"
            className={
                'rounded-[12px] border-[#dee1e6] px-4 py-3 h-[48px] shadow-sm focus:border-[#0B5EA8] focus:ring-[#0B5EA8] font-mono tabular-nums tracking-tight ' +
                className
            }
            value={displayValue}
            onChange={handleChange}
            ref={localRef}
        />
    );
});
