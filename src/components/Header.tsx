import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';


export const Header: FC = () => {
    const navigate = useNavigate();
        const handleNavigation = (path: string) => {
            navigate(path);
        }

    return (
        <div className='Header'>
            <div className="header-container">
                <div className='linkHeader' onClick={() => handleNavigation('/home')}>Home</div>
                <div className='linkHeader' onClick={() => handleNavigation('/library')}>Library</div>
                <div className='linkHeader' onClick={() => handleNavigation('/store')}>Store</div>
            </div>
            <div className="line"></div>
        </div>
    )
}