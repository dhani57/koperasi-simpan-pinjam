export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-full border border-transparent bg-[#0B5EA8] px-5 py-3 text-base font-semibold text-white transition duration-150 ease-in-out hover:bg-[#084A85] focus:bg-[#084A85] focus:outline-none focus:ring-2 focus:ring-[#0B5EA8] focus:ring-offset-2 active:bg-[#073A6E] ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
