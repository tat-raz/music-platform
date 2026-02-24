import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import style from './Header.module.scss';


export const Header: FC = () => {
    const navigate = useNavigate();
    const handleNavigation = (path: string) => {
        navigate(path);
    }

    const auth = useAuth();

    return (
        <div className={style.Header}>
            <div className={style.container}>
                <div className={style.leftSide}>
                    <div className={style.linkHeader} onClick={() => navigate('/home')}>Home</div>
                    <div className={style.linkHeader} onClick={() => navigate('/library')}>Library</div>
                    <div className={style.linkHeader} onClick={() => navigate('/store')}>Store</div>
                </div>
                <div className={style.rightSide}>
                    {!auth.user ? (
                    <button
                        className={style.authButton}
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </button>
                    ) : (
                    <button
                        className={style.authButton}
                        onClick={auth.logout}
                    >
                        Logout
                    </button>
                    )}
                </div>
            </div>
            <div className={style.line}></div>
        </div>
    )
}