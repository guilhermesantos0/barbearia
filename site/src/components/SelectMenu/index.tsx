import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import style from './SelectMenu.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useState } from 'react';

type Option = {
    value: string;
    label: string;
    icon?: ReactNode
};

interface SelectMenuProps {
    options: Option[];
    placeholder?: string;
    onChange: (value: string | undefined) => void;
    value?: string | undefined;
    className?: string;
    searchable?: boolean;
    viewPortClassName?: string;
    freePosition?: boolean;
}

export const SelectMenu: React.FC<SelectMenuProps> = ({
    options,
    placeholder = 'Selecione uma opção',
    onChange,
    value,
    className,
    searchable = false,
    viewPortClassName,
    freePosition
}) => {
    const [search, setSearch] = useState('');

    const filteredOptions = searchable
        ? options.filter((option) =>
              option.label.toLowerCase().includes(search.toLowerCase())
          )
        : options;

    return (
        <Select.Root
            value={value ?? ''}
            onValueChange={(val) => {
                if (val === '__CLEAR__') {
                    onChange(undefined);
                } else {
                    onChange(val)
                }
                setSearch(''); 
            }}
        >
            <Select.Trigger
                className={`${style.SelectTrigger} ${className ? className : ''}`}
            >
                <Select.Value placeholder={value ? value : placeholder} />
                <Select.Icon>
                    <ChevronDownIcon className={style.Icon} />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content
                    className={style.SelectContent}
                    align='start'
                    side="bottom"
                    position={freePosition ? undefined : 'popper'}
                    avoidCollisions={false}
                    sideOffset={4}
                >
                    <Select.Viewport className={`${style.SelectViewport} ${viewPortClassName ? viewPortClassName : ''}`}>
                        {searchable && (
                            <div className={style.SearchBox}>
                                <input
                                    type="text"
                                    placeholder="Pesquisar..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    className={style.SearchInput}
                                />
                            </div>
                        )}

                        {value && (
                            <Select.Item
                                value="__CLEAR__"
                                className={`${style.SelectItem} ${style.ClearSelection}`}
                            >
                                <Select.ItemText>Limpar Seleção</Select.ItemText>
                                <FontAwesomeIcon icon="trash" />
                            </Select.Item>
                        )}

                        {filteredOptions.map((option) => (
                            <Select.Item
                                key={option.value}
                                value={option.value}
                                className={style.SelectItem}
                            >
                                <Select.ItemText> {option.icon ? option.icon : null} {option.label}</Select.ItemText>
                                <Select.ItemIndicator
                                    className={style.SelectItemIndicator}
                                >
                                    <CheckIcon className={style.Icon} />
                                </Select.ItemIndicator>
                            </Select.Item>
                        ))}

                        {filteredOptions.length === 0 && (
                            <div className={style.NoResults}>Nenhum resultado</div>
                        )}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
};