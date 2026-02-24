import { FC } from 'react';
import { Header } from '../../components/Header/Header';
import style from './Home.module.scss';
import { musicCategories } from "../../data/musicData";
import { useAudioPlayer } from '../../hooks/useAudioPlayer';


export const Home: FC = () => {
    const player = useAudioPlayer();

    return (
        <div className={style.Home}>
        <Header />

        <div className={style.body}>
            <div className={style.container}>
            <div className={style.description}>
                <h1>Home</h1>
                <p className={style.text}>Music that is always with you</p>
                <p className={style.text}>Discover new tracks, create playlists and enjoy your favorite songs. Music is emotion, and it is always close to you.</p>
            </div>
            </div>

            <div className={style.categories}>
            {musicCategories.map((category, index) => (
                <div className={style.category} key={index}>
                <div className={style.categoryName}>
                    {category.icon} {category.name}
                </div>

                <div className={style.categoryList}>
                    {category.songs.map((song) => (
                    <div
                        key={song.id}
                        className={style.categoryItem}
                        onClick={() => player.handleTrackClick(song)}
                    >
                        {song.title}
                    </div>
                    ))}
                </div>
                </div>
            ))}
            </div>
        </div>

        {player.currentTrack && (
            <div className={style.player}>
                <div className={style.playerContent}>

                <div className={style.trackInfo}>
                    <div className={style.trackTitle}>{player.currentTrack.title}</div>
                    <div className={style.trackArtist}>{player.currentTrack.artist}</div>
                </div>

                <button className={style.playBtn} onClick={player.handlePlayPause}>
                    {player.isPlaying ? "⏸" : "▶"}
                </button>

                <input
                    type="range"
                    min={0}
                    max={player.duration}
                    step={0.01}
                    value={player.progress}
                    onChange={(e) => player.handleSeek(Number(e.target.value))}
                    className={style.progress}
                    style={{
                        background: `linear-gradient(
                        to right,
                        #4fd1c5 ${(player.progress / player.duration) * 100}%,
                        rgba(0,0,0,0.15) ${(player.progress / player.duration) * 100}%
                        )`
                    }}
                />

                <audio
                    ref={player.audioRef}
                    src={player.currentTrack.previewUrl}
                    onLoadedMetadata={player.handleLoadedMetadata}
                    onPlay={() => player.setIsPlaying(true)}
                    onPause={() => player.setIsPlaying(false)}
                />
                </div>
            </div>
            )}
        </div>
    );
};
