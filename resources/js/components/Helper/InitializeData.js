export default function InitializeData(
        setCurrentPlaylist, 
        currentPlaylist, 
        setCurrentTrack, 
        currentTrack, 
        tracks, 
        track
    ){
        var i = 0;
    if(localStorage.getItem('currentPlaylist') && !currentPlaylist){
        var tracks = JSON.parse(localStorage.getItem('currentPlaylist'));
        var provenTracks = [];
        tracks.map(function(track){
            provenTracks.push(track.id);
        })
        const options = {
            url: 'api/tracks/ids',
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
            },
            withCredentials: true,
            credentials: 'include',
            data: {
                ids: provenTracks
            }
        };
        axios(options)
        .then((res)=>{
            localStorage.setItem('currentPlaylist', JSON.stringify(res.data));
            setCurrentPlaylist(res.data);
            if(localStorage.getItem('currentTrack')){
                res.data.map((track)=>{
                    if(track.id == JSON.parse(localStorage.getItem('currentTrack')).id){
                        localStorage.setItem('currentTrack', JSON.stringify(track));
                        setCurrentTrack(currCurrentTrack => track);
                        if(!window.wavesurfer.isReady){
                            return window.wavesurfer.load(track.file_name);
                        }
                    }
                })
            }else{
                if(!window.wavesurfer.isReady){
                    window.wavesurfer.load(res.data[0].file_name);
                }
            }
        })
    }else if(tracks && track && !currentPlaylist){
        localStorage.setItem('currentPlaylist', JSON.stringify(tracks));
        setCurrentPlaylist(tracks);
        localStorage.setItem('currentTrack', JSON.stringify(track));
        setCurrentTrack(currCurrentTrack => track);
        if(!window.wavesurfer.isReady){
            window.wavesurfer.load(track.file_name);
        }
    }
}