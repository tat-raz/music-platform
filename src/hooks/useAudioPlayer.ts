import { useState, useRef, useEffect } from "react";
import { Track } from "../data/musicData";

export const useAudioPlayer = () => {
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const animationRef = useRef<number>();
    const [isSeeking, setIsSeeking] = useState(false);

    const handleTrackClick = (track: Track) => {
        setCurrentTrack(track);
        setProgress(0);
    };

    const handlePlayPause = () => {
        if (!audioRef.current) return;

        if (audioRef.current.paused) {
        audioRef.current.play();
        animationRef.current = requestAnimationFrame(updateProgress);
        } else {
        audioRef.current.pause();
        if (animationRef.current)
            cancelAnimationFrame(animationRef.current);
        }
    };

    const handleLoadedMetadata = () => {
        if (!audioRef.current) return;
        setDuration(Math.floor(audioRef.current.duration));
    };

    const handleSeek = (value: number) => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = value;
        setProgress(value);
    };

    const updateProgress = () => {
        if (!audioRef.current || isSeeking) {
        animationRef.current = requestAnimationFrame(updateProgress);
        return;
        }

        setProgress(audioRef.current.currentTime);
        animationRef.current = requestAnimationFrame(updateProgress);
    };

    useEffect(() => {
        if (!audioRef.current || !currentTrack) return;

        audioRef.current.currentTime = 0;
        setProgress(0);

        audioRef.current.play();
        animationRef.current = requestAnimationFrame(updateProgress);

        return () => {
        if (animationRef.current)
            cancelAnimationFrame(animationRef.current);
        };
    }, [currentTrack]);

    return {
        currentTrack,
        isPlaying,
        progress,
        duration,
        audioRef,

        handleTrackClick,
        handlePlayPause,
        handleSeek,

        setIsPlaying,
        setIsSeeking,
        handleLoadedMetadata,
    };
};
