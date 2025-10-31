import * as Dialog from '@radix-ui/react-dialog';

import { ReactNode } from "react";

import style from './Modal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ModalProps {
    trigger: ReactNode,
    children: ReactNode,
    close?: boolean,
    customClose?: ReactNode,
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    overflowYShow?: boolean;
    className?: string;
}

const Modal:React.FC<ModalProps> = ({ trigger, children, close, open, onOpenChange, overflowYShow, className }) => {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Trigger asChild>
                {trigger}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={style.Overlay} />
                <Dialog.Content className={`${style.Container} ${overflowYShow ? style.OverflowYShow : ''} ${className ? className : ''}`}>
                    {
                        close && (
                            <Dialog.Close className={style.Close}>
                                <FontAwesomeIcon icon='x' className={style.Icon} />
                            </Dialog.Close>
                        )
                    }

                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default Modal;