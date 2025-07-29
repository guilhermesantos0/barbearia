import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import style from './SelectMenu.module.scss';

type Option = {
    value: string;
    label: string;
};

interface SelectMenuProps {
    options: Option[];
    placeholder?: string;
    onChange: (value: string) => void;
    value?: string;
}

export const SelectMenu: React.FC<SelectMenuProps> = ({
    options,
    placeholder = 'Selecione uma opção',
    onChange,
    value,
}) => {
    return (
        <Select.Root value={value} onValueChange={onChange}>
            <Select.Trigger className={style.SelectTrigger}>
                <Select.Value placeholder={placeholder} />
                <Select.Icon>
                    <ChevronDownIcon className={style.Icon} />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content 
                className={style.SelectContent}
                align="start" 
                side="bottom" 
                position="popper" 
                avoidCollisions={false}
                sideOffset={4}>
                    <Select.Viewport className={style.SelectViewport}>
                        {options.map((option) => (
                            <Select.Item
                                key={option.value}
                                value={option.value}
                                className={style.SelectItem}
                            >
                                <Select.ItemText>{option.label}</Select.ItemText>
                                <Select.ItemIndicator className={style.SelectItemIndicator}>
                                    <CheckIcon className={style.Icon} />
                                </Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
};
