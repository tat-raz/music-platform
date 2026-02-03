import React, { FC, useState, useEffect, useRef } from 'react';
import { Card } from '../components/Card';
import tracksData from '../data/tracks.json';
import { Header } from '../components/Header';
import '../styles/library.css';

interface Track {
    id: number,
    title: string,
    artist: string,
    duration: string
}

interface TrackState {
    isPlaying: boolean,
    progress: number
}

export const Library: FC = () => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [trackStates, setTrackStates] = useState<Record<number, TrackState>>({});
    const intervalsRef = useRef<Record<number, NodeJS.Timeout>>({});
    const timeoutsRef = useRef<Record<number, NodeJS.Timeout>>({});

    useEffect(() => {
        setTracks(tracksData);
    }, []);

    const handlePlayPause = (trackId: number) => {
        setTrackStates(prev => {
            const current = prev[trackId] || { isPlaying: false, progress: 0 };
            const shouldPlay = !current.isPlaying;

            // Очищаем предыдущие таймеры
            clearInterval(intervalsRef.current[trackId]);
            clearTimeout(timeoutsRef.current[trackId]);
            delete intervalsRef.current[trackId];
            delete timeoutsRef.current[trackId];

            const newStates: Record<number, TrackState> = {};

            // Сбрасываем все треки
            Object.keys(prev).forEach(id => {
                const numId = Number(id);
                newStates[numId] = {
                    ...prev[numId],
                    isPlaying: false,
                    progress: numId === trackId ? prev[numId]?.progress : 0
                };
            });

            if (shouldPlay) {
                newStates[trackId] = {
                    isPlaying: true,
                    progress: current.progress
                };

                // Запускаем интервал для прогресса
                intervalsRef.current[trackId] = setInterval(() => {
                    setTrackStates(prev => {
                        const trackState = prev[trackId];
                        if (!trackState?.isPlaying) return prev;

                        const newProgress = trackState.progress + 1;
                        
                        if (newProgress >= 100) {
                            clearInterval(intervalsRef.current[trackId]);
                            delete intervalsRef.current[trackId];
                            return {
                                ...prev,
                                [trackId]: { isPlaying: false, progress: 0 }
                            };
                        }

                        return {
                            ...prev,
                            [trackId]: { ...trackState, progress: newProgress }
                        };
                    });
                }, 100);

                // Таймер для автоматического завершения
                timeoutsRef.current[trackId] = setTimeout(() => {
                    setTrackStates(prev => ({
                        ...prev,
                        [trackId]: { isPlaying: false, progress: 0 }
                    }));
                    clearInterval(intervalsRef.current[trackId]);
                    delete intervalsRef.current[trackId];
                }, 10000);
            }

            return newStates;
        });
    };

    useEffect(() => {
        return () => {
            // Очистка при размонтировании
            Object.values(intervalsRef.current).forEach(clearInterval);
            Object.values(timeoutsRef.current).forEach(clearTimeout);
        };
    }, []);

    return (
        <div className='Library'>
            <Header />
            <div className="library-main">
                <div className='library-title'>My Library</div>
                <div className="cards">
                    {tracks.map((track) => {
                        const trackState = trackStates[track.id] || { isPlaying: false, progress: 0 };
                        return (
                            <Card 
                                key={track.id}
                                id={track.id}
                                title={track.title}
                                artist={track.artist}
                                duration={track.duration}
                                isPlaying={trackState.isPlaying} 
                                progress={trackState.progress} 
                                onPlayPause={handlePlayPause}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    );
};