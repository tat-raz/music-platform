import { FC, useState, useEffect, useRef } from 'react';
import { Card } from '../../components/Card/Card';
import tracksData from '../../data/tracks.json';
import { Header } from '../../components/Header/Header';
import style from './Library.module.scss';
import { Navigate } from 'react-router-dom';
import { Track } from '../../data/musicData';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';


interface TrackState {
    isPlaying: boolean,
    progress: number
}

export const Library: FC = () => {
    const player = useAudioPlayer();
    const [tracks, setTracks] = useState<Track[]>([]);
    
    useEffect(() => {
        setTracks(tracksData);
    }, []);

    return (
        <div className={style.Library}>
            <Header />
            <div className={style.main}>
                <div className={style.title}>My Library</div>
                <div className={style.cards}>
                    {tracks.map((track) => {
                        const isCurrent = player.currentTrack?.id === track.id
                        return (
                            <Card 
                                key={track.id}
                                id={track.id}
                                title={track.title}
                                artist={track.artist}
                                isPlaying={isCurrent && player.isPlaying} 
                                progress={
                                    isCurrent
                                        ? (player.progress / player.duration) * 100
                                        : 0
                                }
                                onPlayPause={() => {
                                    if (isCurrent)
                                        player.handlePlayPause();
                                    else 
                                        player.handleTrackClick(track);
                                }}
                            />
                        )
                    })}
                </div>
            </div>
            <audio
                ref={player.audioRef}
                src={player.currentTrack?.previewUrl}
                onLoadedMetadata={player.handleLoadedMetadata}
                onPlay={() => player.setIsPlaying(true)}
                onPause={() => player.setIsPlaying(false)}  
            />
        </div>
    );
};