export default function FindIndex(
    currentPlaylist,
    currentTrack,
    setTrackPlaylistIndex
){
    for (let i = 0; i < currentPlaylist.length; i++) {
        if (currentTrack.id === currentPlaylist[i].id) {
            setTrackPlaylistIndex([0,i,currentPlaylist.length-1]);
            return [0,i,currentPlaylist.length-1];
        }
    }
}