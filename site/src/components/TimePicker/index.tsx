import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import style from './TimePicker.module.scss';

interface TimePickerRadixProps {
    value: string | undefined;
    onChange: (val: string) => void;
    label?: string;

    defaultOptions?: string[];

    inModal?: boolean;

    minH?: number;
    minM?: number;
    maxH?: number;
    maxM?: number;

    className?: string;
}

const TimePicker:React.FC<TimePickerRadixProps> = ({ value, onChange, label, defaultOptions, inModal, minH = 0, minM = 0, maxH = 24, maxM = 60, className }) => {
    const generateTimes = () => {
        if (defaultOptions) return defaultOptions

        console.log(maxH)

        const times: string[] = [];
        for (let h = minH; h <= maxH ; h++) {
            for (let m = minM; m < maxM; m += 30) {
                if (h === maxH && m > 0) break;

                const hour = h.toString().padStart(2, '0');
                const minute = m.toString().padStart(2, '0');
                times.push(`${hour}:${minute}`);
            }
        }
        return times;
    };

    const times = generateTimes();

    return (
        <div className={`${style.TimePickerContainer} ${inModal ? style.ModalContext  : ''} ${className ? className : ''}`}>
            {label && <label className={style.TimeLabel}>{label}</label>}
            <Select.Root value={value} onValueChange={onChange}>
                <Select.Trigger className={style.Trigger}>
                    <Select.Value placeholder="00:00" />
                    <Select.Icon>
                        <ChevronDownIcon />
                    </Select.Icon>
                </Select.Trigger>

                <Select.Content 
                className={style.Content}
                align={inModal ? 'start' : undefined}
                side={inModal ? 'bottom' : undefined}
                position='popper'
                avoidCollisions={inModal ? false : undefined}
                sideOffset={4}>
                    <Select.ScrollUpButton />
                    <Select.Viewport>
                        {times.map((t) => (
                            <Select.Item key={t} value={t} className={style.Item}>
                                <Select.ItemText>{t}</Select.ItemText>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton />
                </Select.Content>
            </Select.Root>
        </div>
    );
}

export default TimePicker;