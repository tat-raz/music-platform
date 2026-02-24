import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { Input } from "../../components/Input/Input";
import style from './SignIn.module.scss'; 
import { useAuth } from "../../context/AuthContext";

export const SignIn: FC = () => {
    const navigate = useNavigate();
    const handleSign = () => {
        navigate('/register');
    };

    const [ email, setEmail ] = useState('');    
    const handleChangeEmail = (value: string): void => {        
        setEmail(value);
    };

    const [ password, setPassword ] = useState('');
    const handleChangePassword = (value: string): void => {
        setPassword(value);
    };

    const { login } = useAuth();

    const handleLogin = () => {
        const success = login(email, password);

        if (!success) {
            alert("Invalid credentials");
            return;
        }

        navigate('/home');
    };


    return (
        <div className={style.SignIn}>
            <Header />
            <div className={style.container}>
                <div className={style.form}>
                    <div className={style.redirection}>
                        <p className={style.haveAccount}>I don't have an account</p>
                        <button className={style.loginButton} onClick={handleSign}>Sign up</button>
                    </div>
                    <Input 
                        type="email"
                        name="email"
                        placeholder="Enter a email"
                        value={email}
                        handleChange={handleChangeEmail}
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder="Enter a password"
                        value={password}
                        handleChange={handleChangePassword}
                    />
                    <button className={style.loginButton} onClick={handleLogin}>Sign in</button>
                </div>
            </div>
        </div>
    )
}