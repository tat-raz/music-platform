import { FC } from 'react';
import { FaPlay, FaPause } from "react-icons/fa";
import style from './Card.module.scss';


interface CardProps {
    id: number,
    title: string,
    artist: string,
    isPlaying: boolean,
    progress: number,
    onPlayPause: (trackId: number) => void
}

export const Card: FC<CardProps> = ({id, title, artist, isPlaying, progress, onPlayPause}) => {

    const handlePlayPause = () => {
        onPlayPause(id); 
    };

    return (
        <div className={style.Card}>
            <div className={style.artist}>{artist}</div>
            <div className={style.song}>
                <div className={style.cardTitle}>{title}</div>
            </div>
            <div className={style.player}>
                <div className={style.timing}>
                    <button className={style.playPause} onClick={handlePlayPause}>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <div className={style.progressBar}>
                        <div className={style.progress} style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>       
        </div>
    )
}