import { useRef, useState } from 'react';
import style from './Login.module.scss';
import { ArrowRightIcon, ArrowLeftIcon, CheckIcon } from '@radix-ui/react-icons';
import * as Checkbox from '@radix-ui/react-checkbox';
import api from '../../services/api';

import OTPInput from '../../components/OTPInput';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

const Login = () => {
    const [currentState, setCurrentState] = useState<'login' | 'signup'>('login')
    const [signupStage, setSignupStage] = useState<1 | 2 | 3 | 4>(1);
    const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);
    const [rememberUser, setRememberUser] = useState<boolean>(false);

    const navigate = useNavigate();

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR');
    };

    const [loginFormData, setLoginFormData] = useState({
        mailOrPhone: '',
        password: ''
    });

    const [signupFormData, setSignupFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
        bornDate: '',
        gender: ''
    })

    const [confirmPassword, setConfirmPassword] = useState('');

    
    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignupFormData(prev => ({ ...prev, [name]: value }));
    }

    const loginBarRef = useRef<HTMLDivElement>(null);
    const signupBarRef = useRef<HTMLDivElement>(null);

    const handleOpenSignUp = () => {
        setCurrentState('signup');
        
        signupBarRef.current!.style.opacity = '1'
        loginBarRef.current!.style.transform = 'translateX(-100%)'
        signupBarRef.current!.style.transform = 'translateX(0%)'
        
        setTimeout(() => {
            loginBarRef.current!.style.opacity = '0'
        }, 600)
    }
    
    const handleOpenLogin = () => {
        setCurrentState('login');
        
        loginBarRef.current!.style.opacity = '1'
        signupBarRef.current!.style.transform = 'translateX(100%)'
        loginBarRef.current!.style.transform = 'translateX(0%)'
        
        setTimeout(() => {
            signupBarRef.current!.style.opacity = '0'
        }, 600)
    }


    const handleOTPComplete = async (code: string) => {
        const isValid = true 
        if (isValid) {
            setTimeout(() => {
                nextStage();
            }, 1000)
            return true
        } else {
            return false
        };

    }

    const resendCode = async () => {
        // REENVIAR O EMAIL
    }

    const handleCheckEmail = () => {
        
    }

    const handleCreateAccount = () => {

    }

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.post(
                '/auth/login',
                {
                    email: loginFormData.mailOrPhone,
                    password: loginFormData.password,
                    remember: rememberUser
                },
                {
                    withCredentials: true
                }
            );

            const response = await api.get('/auth/profile', {
                withCredentials: true
            });

            const user = response.data;

            navigate(user.role === 0 ? `/home/cliente/agendamentos` : `/home/barbeiro/agendamentos`);

        } catch (error: any) {
            if (error.response) {
                toast.error(`${error.response.data.message}`)
            } else {
                console.error('Erro ao fazer login:', error);
                toast.error('Erro ao conectar com o servidor')
            }
        }
    };


    const nextStage = () => {
        setSignupStage(prev => (prev + 1) as 1 | 2 | 3 | 4);
    }

    const prevStage = () => {
        setSignupStage(prev => (prev - 1) as 1 | 2 | 3 | 4)
    }

    return (
        <div className={style.Container}>
            <img className={`${style.Logo} ${currentState === 'login' ? style.Login : style.Signup}`} src="/logo.svg" alt="BarberPrime" loading='lazy' />
            <div className={`${style.Bar} ${style.Login}`} ref={loginBarRef}>
                <h1 className={style.Title}>Entre na sua conta!</h1>
                <form action="login" className={style.FormContainer}>

                    <div className={style.InputContainer}>
                        <label className={style.Label} htmlFor="mailOrPhone">Email ou Telefone</label>
                        <input autoComplete='off' className={style.Input} type="email" name='mailOrPhone' placeholder='email@teste.com' value={loginFormData.mailOrPhone} onChange={handleLoginChange} />
                    </div>
                    <div className={style.InputContainer}>
                        <label className={style.Label} htmlFor="password">Senha</label>
                        <input autoComplete='off' className={style.Input} type="password" name='password' placeholder='••••••••' value={loginFormData.password} onChange={handleLoginChange} />
                        <div className={style.BottomPassword}>
                            <div className={style.Checkbox}>
                                <Checkbox.Root
                                    className={style.CheckboxRoot}
                                    id="remember"
                                    name="remember"
                                    checked={rememberUser}
                                    onCheckedChange={(checked) => setRememberUser(!!checked)}
                                >
                                    <Checkbox.Indicator className={style.CheckboxIndicator}>
                                        <CheckIcon width={16} height={16} />
                                    </Checkbox.Indicator>
                                </Checkbox.Root>

                                <label htmlFor="remember" className={style.Label}> Lembrar por 7 dias</label>
                            </div>
                            <h5 className={style.Recovery}>Esqueci minha senha</h5>
                        </div>
                    </div>

                    <button className={style.Button} onClick={handleLoginSubmit}>Login</button>
                </form>
                <p className={style.AuxiliarText}>Ainda não possui conta? <span className={style.Link} onClick={handleOpenSignUp}>cadastre-se</span></p>
            </div>

            <div className={`${style.Bar} ${style.SignUp} ${signupStage === 4 ? style.FourthStageSignup : ''}`} ref={signupBarRef}>
                <form action="login" className={style.FormContainer}>
                    {
                        signupStage === 1 && (
                            <>
                                <h1 className={style.Title}>Crie sua conta!</h1>

                                <div className={style.InputContainer}>
                                    <label className={style.Label} htmlFor="email">Seu melhor email</label>
                                    <input autoComplete='off' className={style.Input} type="email" name='email' placeholder='email@teste.com' value={signupFormData.email} onChange={handleSignupChange} />
                                </div>

                                <button className={style.Button} onClick={nextStage}>Iniciar <ArrowRightIcon className={style.Icon} /></button>
                                <p className={style.AuxiliarText}>Já tem uma conta? <span className={style.Link} onClick={handleOpenLogin}>entre aqui</span></p>
                            </>
                        )
                    }

                    {
                        signupStage === 2 && (
                            <>
                                <h1 className={style.Title}>Confirme seu email!</h1>
                                <h2 className={style.Subtitle}>Insira o código de 6 dígitos enviado para o seu email:</h2>
                                <h2 className={style.Subtitle}>e****@t***e.com.br</h2>

                                <OTPInput length={6} resendTimeout={5} onOTPComplete={handleOTPComplete} resendCode={resendCode} alterReciever={prevStage} />
                                
                            </>
                        )
                    }

                    {
                        signupStage === 3 && (
                            <>
                                <h1 className={style.Title}>Crie uma senha forte!</h1>

                                <div className={style.InputContainer}>
                                    <label className={style.Label} htmlFor="password">Senha</label>
                                    <input autoComplete='off' className={style.Input} type="password" name='password' placeholder='••••••••' value={signupFormData.password} onChange={handleSignupChange} />
                                </div>
                                <div className={style.InputContainer}>
                                    <label className={style.Label} htmlFor="confirmPassword">Repita sua senha</label>
                                    <input autoComplete='off' className={style.Input} type="password" name='confirmPassword' placeholder='••••••••' value={signupFormData.password} onChange={handleSignupChange} />
                                    <h5 className={style.Recovery}>Esqueci minha senha</h5>
                                </div>

                                <button className={style.Button} onClick={nextStage}>Avançar</button>
                                <p className={`${style.AuxiliarText} ${style.AlignLeft}`} onClick={prevStage}><ArrowLeftIcon /> Voltar</p>
                            </>
                        )
                    }

                    {
                        signupStage === 4 && (
                            <>
                                <h1 className={style.Title}>Conte mais sobre você!</h1>

                                <div className={style.InputsArea}>
                                    <div className={`${style.InputContainer} ${style.NameInput}`}>
                                        <label className={style.Label} htmlFor="name">Nome Completo</label>
                                        <input autoComplete='off' className={style.Input} type="text" name='name' placeholder='Nome Sobrenome' value={signupFormData.name} onChange={handleSignupChange} />
                                    </div>

                                    <div className={`${style.InputContainer} ${style.Phone}`}>
                                        <label className={style.Label} htmlFor="phone">Telefone</label>
                                        <input autoComplete='off' className={style.Input} type="text" name='phone' placeholder='+55 (11) 99999-9999' value={signupFormData.password} onChange={handleSignupChange} />
                                    </div>

                                    <div className={`${style.InputContainer} ${style.BornDate}`}>
                                        <label className={style.Label} htmlFor="bornDate">Data de nascimento <span className={style.Description}>(Você pode ganhar brindes no aniversário)</span></label>
                                        <input autoComplete='off' className={style.Input} type="text" name='bornDate' placeholder={formatDate(new Date())} value={signupFormData.password} onChange={handleSignupChange} />
                                    </div>

                                    <div className={`${style.InputContainer} ${style.Gender}`}>
                                        <label className={style.Label} htmlFor="password">Sexo</label>
                                        <input autoComplete='off' className={style.Input} type="password" name='password' placeholder='••••••••' value={signupFormData.password} onChange={handleSignupChange} />
                                    </div>

                                    <div className={style.Checkbox}>
                                        <Checkbox.Root
                                            className={style.CheckboxRoot}
                                            id="terms"
                                            name="terms"
                                            checked={isTermsAccepted}
                                            onCheckedChange={(checked) => setIsTermsAccepted(!!checked)}
                                        >
                                            <Checkbox.Indicator className={style.CheckboxIndicator}>
                                                <CheckIcon width={16} height={16} />
                                            </Checkbox.Indicator>
                                        </Checkbox.Root>

                                        <label htmlFor="terms" className={style.Label}>
                                            Li e concordo com os <a href="#">Termos de Uso</a> e <a href="#">Política de Privacidade</a>
                                        </label>
                                    </div>
                                </div>

                                <button disabled={!isTermsAccepted} className={`${style.Button} ${style.Short} ${!isTermsAccepted ? style.Disabled : ''}`} onClick={handleCreateAccount}>Criar Conta</button>
                                <p className={`${style.AuxiliarText} ${style.AlignLeft}`} onClick={prevStage}><ArrowLeftIcon /> Voltar</p>
                            </>
                        )
                    }
                </form>
            </div>
        </div>
    )
}

export default Login