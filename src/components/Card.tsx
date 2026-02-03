import { FC, useState } from 'react';
import '../styles/card.css';
import { FaPlay, FaPause } from "react-icons/fa";


interface CardProps {
    id: number,
    title: string,
    artist: string,
    duration: string,
    isPlaying: boolean,
    progress: number,
    onPlayPause: (trackId: number) => void
}

export const Card: FC<CardProps> = ({id, title, artist, duration, isPlaying, progress, onPlayPause}) => {

    const handlePlayPause = () => {
        onPlayPause(id); 
    };

    return (
        <div className='Card'>
            <div className="artist">{artist}</div>
            <div className='song'>
                <div className='card-title'>{title}</div>
            </div>
            <div className="player">
                <div className="duration">{duration}</div> 
                <div className="timing">
                    <button className="play-pause" onClick={handlePlayPause}>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>       
        </div>
    )
}