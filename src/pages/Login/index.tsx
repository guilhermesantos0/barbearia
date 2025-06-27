import style from './Login.module.scss';

// import Logo from '/logo.svg';
const Login = () => {
    return (
        <div className={style.Container}>
            <img className={style.Logo} src="/logo.svg" alt="BarberPrime" />
            <div className={style.LeftBar}>
                <h1 className={style.Title}>Entre na sua conta!</h1>
                <form action="login" className={style.FormContainer}>

                    <div className={style.InputContainer}>
                        <label className={style.Label} htmlFor="email">Email ou Telefone</label>
                        <input autoComplete='off' className={style.Input} type="email" name='email' placeholder='email@teste.com' />
                    </div>
                    <div className={style.InputContainer}>
                        <label className={style.Label} htmlFor="password">Senha</label>
                        <input autoComplete='off' className={style.Input} type="password" name='password' placeholder='••••••••' />
                        <h5 className={style.Recovery}>Esqueci minha senha</h5>
                    </div>

                    <button className={style.Login}>Login</button>
                </form>
                <p className={style.Create}>Ainda não possui conta? <span className={style.Link}>cadastre-se</span></p>
            </div>
        </div>
    )
}

export default Login