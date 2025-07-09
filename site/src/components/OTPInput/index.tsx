import { useRef, useState } from 'react';
import style from './OTPInput.module.scss';

interface Props {
    length: number;
    resendTimeout: number;
    onOTPComplete: (code: string) => Promise<boolean>;
    resendCode: () => void;
    alterReciever: () => void;
}

const OTPInput: React.FC<Props> = ({ length, resendTimeout: _resendTimeout , onOTPComplete, resendCode, alterReciever }) => {
    const [otp, setOtp] = useState(Array(length).fill(''));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const [hasValidated, setHasValidated] = useState<boolean>(false);
    const [isValidCode, setIsValidCode] = useState<boolean>(false);

    const [resendTimeout, setResendTimeout] = useState<number>(_resendTimeout * 1000)

    const handleChange = async (value: string, index: number) => {
        if (!/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }

        if (newOtp.every(d => d !== '')) {
            const isCodeValid = await onOTPComplete(newOtp.join(''));
            setHasValidated(true);
            setIsValidCode(isCodeValid)
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {

        if (e.key === 'Backspace') {
            e.preventDefault();

            const newOtp = [...otp];

            if (otp[index]) {
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputsRef.current[index - 1]?.focus();
            }

            setHasValidated(false)
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').slice(0, length);
        const newOtp = paste.split('').filter(char => /^\d$/.test(char));
        setOtp((prev) => 
            [...Array(length)].map((_, i) => newOtp[i] || prev[i])
        );
        inputsRef.current[newOtp.length - 1]?.focus();
    };

    return (
        <>
            <div className={style.Container}>
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        type="number"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        ref={(el) => {
                            inputsRef.current[index] = el;
                        }}
                        className={`${style.OtpBox} ${hasValidated ? (isValidCode ? style.ValidCode : style.InvalidCode) : ''}`}
                        autoComplete='off'
                    />
                ))}
            </div>
            <div className={style.BottomInfos}>
                { hasValidated && !isValidCode && (
                    <p>Código inválido, tente novamente</p>
                ) }
                <button className={style.Button} disabled={isValidCode}>Enviar Novamente</button>
                <div className={style.TextArea}>
                    <p onClick={alterReciever} className={style.AuxiliarButton} >Alterar email</p>
                </div>
            </div>
        </>
    );
};

export default OTPInput;
