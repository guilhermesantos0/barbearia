import { useRef, useState } from 'react';
import style from './OTPInput.module.scss';

interface Props {
    length: number;
    onOTPComplete: () => void;
}

const OTPInput: React.FC<Props> = ({ length, onOTPComplete }) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);  // Tipando o useRef corretamente

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        // Foco para o próximo input
        if (value !== '' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && otp[index] === '') {
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    return (
        <></>
    );
};

export default OTPInput;
