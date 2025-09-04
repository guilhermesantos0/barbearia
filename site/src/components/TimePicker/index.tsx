import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import style from './TimePicker.module.scss';

interface TimePickerRadixProps {
    value: string;
    onChange: (val: string) => void;
    label?: string;

    minH?: number,
    minM?: number,
    maxH?: number,
    maxM?: number
}

const TimeInput:React.FC<TimePickerRadixProps> = ({ value, onChange, label, minH = 0, minM = 0, maxH = 24, maxM = 60 }) => {
    const generateTimes = () => {
        const times: string[] = [];
        for (let h = minH; h < maxH; h++) {
            for (let m = minM; m < maxM; m += 30) {
                const hour = h.toString().padStart(2, '0');
                const minute = m.toString().padStart(2, '0');
                times.push(`${hour}:${minute}`);
            }
        }
        return times;
    };

    const times = generateTimes();

    return (
        <div className={style.TimeInputContainer}>
            {label && <label className={style.TimeLabel}>{label}</label>}
            <Select.Root value={value} onValueChange={onChange}>
                <Select.Trigger className={style.Trigger}>
                    <Select.Value placeholder="Escolha um horário" />
                    <Select.Icon>
                        <ChevronDownIcon />
                    </Select.Icon>
                </Select.Trigger>

                <Select.Content 
                className={style.Content}
                align="start" 
                side="bottom" 
                position="popper" 
                avoidCollisions={false}
                sideOffset={4}>
                    <Select.ScrollUpButton />
                    <Select.Viewport>
                        {times.map((t) => (
                            <Select.Item key={t} value={t} className={style.Item}>
                                <Select.ItemText>{t}</Select.ItemText>
                                <Select.ItemIndicator>
                                    <CheckIcon />
                                </Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton />
                </Select.Content>
            </Select.Root>
        </div>
    );
}

export default TimeInput;