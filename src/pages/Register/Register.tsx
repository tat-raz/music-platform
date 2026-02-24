import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { Input } from "../../components/Input/Input";
import style from './Register.module.scss';
import { useAuth } from "../../context/AuthContext";


export const Register: FC = () => {
    const navigate = useNavigate();
    const handleSign = () => {
        navigate("/signin");
    };

    const [ name, setName ] = useState('');    
    const handleChangeName = (value: string): void => {        
        setName(value);
    };

    const [ email, setEmail ] = useState('');
    const handleChangeEmail = (value: string): void => {
        setEmail(value);
    };

    const [ password, setPassword ] = useState('');
    const handleChangePassword = (value: string): void => {
        setPassword(value);
    };

    const handleClear = () => {
        setName('');
        setEmail('');
        setPassword('');
    };

    const { register } = useAuth();

    const handleRegister = () => {
        const success = register(name, email, password);

        if (!success) {
            alert('User with this email already exists');
            return;
        }

        navigate('/signin');
    };

    return (
        <div className={style.Register}>
            <Header />
            <div className={style.container}>
                <div className={style.form}>
                    <div className={style.redirection}>
                        <p className={style.haveAccount}>I already have an account</p>
                        <button className={style.loginButton} onClick={handleSign}>Sign in</button>
                    </div>
                    <Input 
                        type="text"
                        name="username"
                        placeholder="Enter a username"
                        value={name}
                        handleChange={handleChangeName}
                    />
                    <Input 
                        type="email"
                        name="email"
                        placeholder="Enter an email"
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
                    <div className={style.sendButtons}>
                        <button className={style.loginButton} onClick={handleRegister}>Create an account</button>
                        <button className={style.loginButton} onClick={handleClear}>Clear fields</button>
                    </div>
                </div>
            </div>
        </div>
    )
}