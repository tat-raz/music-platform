import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/register.css';
import { Header } from "../components/Header";
import { Input } from "../components/Input";


export const SignIn: FC = () => {
    const navigate = useNavigate();
    const handleSign = () => {
        navigate('/register');
    };

    const [ name, setName ] = useState('');    
    const handleChangeName = (value: string): void => {        
        setName(value);
    };

    const [ password, setPassword ] = useState('');
    const handleChangePassword = (value: string): void => {
        setPassword(value);
    };

    return (
        <div className="Register">
            <Header />
            <div className="form-main">
                <div className="form">
                    <div className="wrapper-form">
                        <div className="redirection">
                            <p className="have-account">I don't have an account</p>
                            <button className="login-btn" onClick={handleSign}>Sign up</button>
                        </div>
                        <Input 
                            type="text"
                            name="username"
                            placeholder="Enter a username"
                            value={name}
                            handleChange={handleChangeName}
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Enter a password"
                            value={password}
                            handleChange={handleChangePassword}
                        />
                        <button className="login-btn" style={{ margin: '20px' }}>Sign in</button>
                    </div>
                </div>
            </div>
        </div>
    )
}