import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/register.css';
import { Header } from "../components/Header";
import { Input } from "../components/Input";


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

    return (
        <div className="Register">
            <Header />
            <div className="form-main">
                <div className="form">
                    <div className="wrapper-form">
                        <div className="redirection">
                            <p className="have-account">I already have an account</p>
                            <button className="login-btn" onClick={handleSign}>Sign in</button>
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
                        <div className="send-btns">
                            <button className="login-btn">Create an account</button>
                            <button className="login-btn" onClick={handleClear}>Clear fields</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}