import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

// @ts-ignore
import { IService } from '@types/Service';
// @ts-ignore
import { SelectMenu } from '@components/SelectMenu';
// @ts-ignore
import api from '@services/api';
import MustacheIcon from '@assets/icons/mustache.svg?react';
// @ts-ignore
import { formatPrice } from '@utils/formatPrice';
// @ts-ignore
import { fomratTimeDuration } from '@utils/formatTimeDuration';
import style from './EditService.module.scss';

const EditService = () => {
    const [searchParams] = useSearchParams();
    const serviceId = searchParams.get('serviceId');
    const navigate = useNavigate();
    const queryClient = useQueryClient();


    const [serviceData, setServiceData] = useState<IService>({
        _id: '',
        name: '',
        description: '',
        price: 0,
        duration: 0,
        category: 'other_services',
        active: true
    });

    const [priceInput, setPriceInput] = useState('');
    const [durationInput, setDurationInput] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const categoryOptions = [
        { value: 'hair_services', label: 'Serviços de Cabelo' },
        { value: 'beard_services', label: 'Serviços de Barba' },
        { value: 'stetic_services', label: 'Serviços Estéticos' },
        { value: 'combo_services', label: 'Serviços Combo' },
        { value: 'other_services', label: 'Outros Serviços' }
    ];

    useEffect(() => {
        if (serviceId) {
            fetchService();
        }
    }, [serviceId]);

    const fetchService = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/services/${serviceId}`);
            if (response.status === 200) {
                setServiceData(response.data);
                setPriceInput(formatPrice(response.data.price));
                setDurationInput(fomratTimeDuration(response.data.duration));
            }
        } catch (error) {
            toast.error('Erro ao carregar dados do serviço');
            navigate('/home/admin/servicos');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const response = await api.put(`/services/${serviceId}`, serviceData);
            
            if (response.status === 200) {
                toast.success('Serviço atualizado com sucesso!');
                queryClient.invalidateQueries({ queryKey: ['services'] });
                navigate('/home/admin/servicos');
            } else {
                toast.error('Erro ao atualizar serviço');
            }
        } catch (error) {
            toast.error('Erro ao atualizar serviço');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/home/admin/servicos');
    };

    if (loading) {
        return (
            <div className={style.Container}>
                <div className={style.Loading}>
                    <FontAwesomeIcon icon="spinner" spin size="2x" />
                    <p>Carregando dados do serviço...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={style.Container}>
            <div className={style.Header}>
                <button className={style.BackButton} onClick={handleCancel}>
                    <FontAwesomeIcon icon="arrow-left" />
                    Voltar
                </button>
                <h1 className={style.Title}>Editar Serviço</h1>
            </div>

            <div className={style.Content}>
                <div className={style.ServicePreview}>
                    <div className={style.ServiceIcon}>
                        {serviceData.category === 'beard_services' ? (
                            <MustacheIcon className={style.Icon} />
                        ) : (
                            <FontAwesomeIcon 
                                className={style.Icon} 
                                icon={(() => {
                                    const iconMap: Record<string, IconProp> = {
                                        'hair_services': 'scissors',
                                        'stetic_services': 'droplet',
                                        'combo_services': 'gift',
                                        'other_services': 'gear'
                                    };
                                    return iconMap[serviceData.category] || 'power-off';
                                })()} 
                            />
                        )}
                    </div>
                    <div className={style.ServiceInfo}>
                        <h2 className={style.ServiceName}>{serviceData.name}</h2>
                        <p className={style.ServiceDescription}>{serviceData.description}</p>
                    </div>
                </div>

                <div className={style.FormContainer}>
                    <div className={style.FormGrid}>
                        <div className={style.FormField}>
                            <label className={style.FormLabel}>Nome do serviço</label>
                            <input 
                                type="text" 
                                placeholder="Nome do serviço" 
                                value={serviceData.name} 
                                onChange={(e) => setServiceData({ ...serviceData, name: e.target.value })} 
                                className={style.FormInput}
                            />
                        </div>
                        
                        <div className={style.FormField}>
                            <label className={style.FormLabel}>Descrição</label>
                            <textarea 
                                placeholder="Descrição do serviço" 
                                value={serviceData.description} 
                                onChange={(e) => setServiceData({ ...serviceData, description: e.target.value })} 
                                className={style.FormTextarea}
                                rows={4}
                            />
                        </div>
                        
                        <div className={style.FormField}>
                            <label className={style.FormLabel}>Preço</label>
                            <input 
                                type="text" 
                                placeholder="R$ 0,00" 
                                value={priceInput} 
                                onChange={(e) => {
                                    setPriceInput(e.target.value);
                                }} 
                                onBlur={(e) => {
                                    const rawValue = e.target.value.replace(/[^\d,.]/g, '');
                                    let numericValue = 0;
                                    
                                    if (rawValue.includes(',')) {
                                        numericValue = parseFloat(rawValue.replace(',', '.')) || 0;
                                    } else if (rawValue.includes('.')) {
                                        numericValue = parseFloat(rawValue) || 0;
                                    } else if (rawValue) {
                                        numericValue = parseFloat(rawValue) / 100;
                                    }
                                    
                                    const priceInCents = Math.round(numericValue * 100);
                                    setServiceData({ ...serviceData, price: priceInCents });
                                    setPriceInput(formatPrice(priceInCents));
                                }}
                                className={style.FormInput}
                            />
                        </div>
                        
                        <div className={style.FormField}>
                            <label className={style.FormLabel}>Duração</label>
                            <input 
                                type="text" 
                                placeholder="30 min" 
                                value={durationInput} 
                                onChange={(e) => {
                                    setDurationInput(e.target.value);
                                }} 
                                onBlur={(e) => {
                                    // Extract numbers from the input
                                    const rawValue = e.target.value.replace(/[^\d]/g, '');
                                    const numericValue = parseInt(rawValue) || 0;
                                    setServiceData({ ...serviceData, duration: numericValue });
                                    setDurationInput(fomratTimeDuration(numericValue));
                                }}
                                className={style.FormInput}
                            />
                        </div>
                        
                        <div className={style.FormField}>
                            <label className={style.FormLabel}>Categoria</label>
                            <SelectMenu
                                options={categoryOptions}
                                placeholder="Selecione uma categoria"
                                value={serviceData.category}
                                onChange={(value: string | undefined) => setServiceData({ ...serviceData, category: value || 'other_services' })}
                                className={style.FormSelect}
                            />
                        </div>

                        <div className={style.FormField}>
                            <label className={style.FormLabel}>Status</label>
                            <div className={style.StatusToggle}>
                                <span className={`${style.StatusLabel} ${serviceData.active ? style.Active : style.Inactive}`}>
                                    {serviceData.active ? 'Ativo' : 'Inativo'}
                                </span>
                                <button 
                                    className={`${style.ToggleButton} ${serviceData.active ? style.Active : ''}`}
                                    onClick={() => setServiceData({ ...serviceData, active: !serviceData.active })}
                                >
                                    <div className={style.ToggleSlider}></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={style.Actions}>
                        <button 
                            onClick={handleCancel} 
                            className={style.CancelButton}
                            disabled={saving}
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleSave} 
                            className={style.SaveButton}
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <FontAwesomeIcon icon="spinner" spin />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon="save" />
                                    Salvar Alterações
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditService;
