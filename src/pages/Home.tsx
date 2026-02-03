import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import { Header } from '../components/Header';


const musicCategories = [
    {
        name: "Rock",
        icon: "🎸",
        songs: ["Bohemian Rhapsody", "Stairway to Heaven", "Hotel California"]
    },
    {
        name: "Pop",
        icon: "🎤",
        songs: ["Shape of you", "Blinding Lights", "Levitating"]
    },
    {
        name: "Hip-Hop",
        icon: "🎧",
        songs: ["Sicko Mode", "God`s Plan", "Old Town Road"]
    },
    {
        name: "Funk",
        icon: "🎷",
        songs: ["Uptown Funk", "Superstition", "Get lucky"]
    },
    {
        name: "Jazz",
        icon: "🎺",
        songs: ["Take Five", "So What", "Blue in Green"]
    }
]

export const Home: FC = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/register');
    };

    return (
        <div className='Home'>
            <Header />
            <div className="body">
                <div className="home-container">
                    <div className="home-main">
                        <h1>Home</h1>
                        <p className='text'>Music that is always with you</p>
                        <p className='text'>Discover new tracks, create playlists and enjoy your favorite songs. Music is emotion, and it is always close to you.</p>
                    </div>
                    {/* <div className="aside">
                        <div className='asideHeader'>New Release</div>
                    </div> */}

                    {/* <div className="highlight">
                        <div className='create-profile'>Create Musician Profile</div>
                        <button className='started-btn' onClick={handleGetStarted}>Get Started</button>
                    </div> */}
                </div>

                <div className="categories">
                    {musicCategories.map((category, index) => (
                        <div className="category" key={index}>
                            <div className="category-name">{category.icon} {category.name}</div>
                            <div className="category-list">
                                {category.songs.map((song, i) => (
                                    <div key={i} className="category-item">{song}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                
            </div>
            <div className="footer">
                {/* <p>© 2025 Music Portal</p>
                <div className="social-icons">
                    <a href="#"><i className="fab fa-facebook"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                </div> */}
            </div>
        </div>
    )
}