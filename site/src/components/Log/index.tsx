import { ChevronDownIcon } from '@radix-ui/react-icons';

import * as Accordion from '@radix-ui/react-accordion';

// @ts-ignore
import { ILog } from "@types/Log"
// @ts-ignore
import { IUser } from '@types/User';

import style from './Log.module.scss';
import { ReactNode, useEffect, useState } from 'react';
// @ts-ignore
import { formatDate } from '@utils/formatDate';

interface logProps {
    data: ILog
}

const Log:React.FC<logProps> = ({ data }) => {

    const [title, setTitle] = useState<string>();
    const [actions, setActions] = useState<ReactNode[]>();
    const [date, setDate] = useState<string>();
    
    useEffect(() => {

        const dataNames: Record<string, string> = {
            'name': 'Nome',
            'date': 'Data'
        }

        if(data.data) {
            const changes: ReactNode[] = Object.entries(data.data).map(([ key, value ]) => {
                if(typeof value === 'object' && 'old' in value && 'new' in value) {
                    if (key === 'date') {
                        return (<p>Alterou <span className={style.Highlight}>{dataNames[key]}</span>: {formatDate(value.old)} para {formatDate(value.new)} </p>)
                    }
                    return (<p>Alterou <span className={style.Highlight}>{dataNames[key]}</span>: {value.old} para {value.new} </p>)
                }
                return ( <p>Alterou <span className={style.Highlight}>{dataNames[key]}</span>: "{JSON.stringify(value)}"</p> )
            })

            setActions(changes);
        }

    }, [data])

    return(
        <Accordion.Root type='single' collapsible className={style.Container}>
            <Accordion.Item value='log' className={style.LogItem}>
                <Accordion.Header>
                    {
                        data.data ? (
                            <Accordion.Trigger className={style.Title}>
                                <p><span className={style.ActiveUser}>{(data.userId as IUser).name}</span> atualizou <span className={style.Target}>{data.target.name}</span></p>
                                <ChevronDownIcon className={style.Icon} />
                            </Accordion.Trigger>
                        ) : (
                            <p className={style.Title}>
                                <span className={style.ActiveUser}>{(data.userId as IUser).name}</span> atualizou <span className={style.Target}>{data.target.name}</span>
                            </p>
                        )
                    }
                </Accordion.Header>
                <Accordion.Content className={style.Content}>
                    {
                        actions && actions?.length > 0 ? (
                            <ol className={style.actions}>
                                {
                                    actions.map((action) => (
                                        <li className={style.Action}>{action}</li>
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