import FindIndex from './FindIndex'

export default function SetPlaylistToLocal(
    e,
    currentTrack,
    setCurrentTrack,
    currentPlaylist,
    setCurrentPlaylist,
    play,
    setPlay,
    tracks,
    setTrackPlaylistIndex,
    sidebar = false
){
    if(currentTrack && currentTrack.id == e.target.closest('.playToggle').dataset.idenity){
        if(play){
            window.wavesurfer.pause();
            setPlay(false);
        }else{
            window.wavesurfer.play();
            setPlay(true);
        }
    }else{
        e.persist();
        var element = e.target.closest('.playToggle');
        if(!sidebar && currentPlaylist !== tracks){
            localStorage.setItem('currentPlaylist', JSON.stringify(tracks));
            setCurrentPlaylist(tracks);
        }
        localStorage.setItem('currentTrack', JSON.stringify(tracks[element.dataset.id]));
        setCurrentTrack(tracks[element.dataset.id]);
        
        var index = FindIndex(
            tracks ? tracks : currentPlaylist,
            tracks ? tracks[element.dataset.id] : currentTrack,
            setTrackPlaylistIndex
        );   
        window.wavesurfer.stop();
        window.wavesurfer.empty();
        window.wavesurfer.load(tracks[element.dataset.id].file_name);
        window.wavesurfer.on('ready', (e) => {
            window.wavesurfer.play();
            setPlay(true);
        });
    }
}