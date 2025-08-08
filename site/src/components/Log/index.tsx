import { ChevronDownIcon } from '@radix-ui/react-icons';

import * as Accordion from '@radix-ui/react-accordion';

import { ILog } from "@types/Log"

import style from './Log.module.scss';
import { useEffect, useState } from 'react';

interface logProps {
    data: ILog
}

const Log:React.FC<logProps> = ({ data }) => {

    const [title, setTitle] = useState<string>();
    const [actions, setActions] = useState<string[]>();
    const [date, setDate] = useState<string>();

    useEffect(() => {
        if (!data) return;

        const dataActionsText = {
            'USER_PROFILE_UPDATE': `Atualizou o perfil de ${data.target}`
        }

        const generatedTitle = ``

    }, [data])

    return(
        <Accordion.Root type='single' collapsible className={style.Container}>
            <Accordion.Item value='log' className={style.LogItem}>
                <Accordion.Header>
                    {
                        data.data ? (
                            <Accordion.Trigger className={style.Title}>{title} <ChevronDownIcon className={style.Icon} /></Accordion.Trigger>
                        ) : (
                            <p className={style.Title}>{title}</p>
                        )
                    }
                </Accordion.Header>
                <Accordion.Content>
                    {
                        actions && actions?.length > 0 ? (
                            <ol className={style.actions}>
                                {
                                    actions.map((action) => (
                                        <pre className={style.Action}>{action}</pre>
                                    ))
                                }
                            </ol>
                        ) : (
                            <p>Não há ações disponíveis</p>
                        )
                    }
                </Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
    )
}

export default Log;