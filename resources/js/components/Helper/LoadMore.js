export default function LoadMore(
    end,
    setEnd,
    isMount,
    loading,
    setLoading,
    data,
    setData,
    direction,
    genre_id = null,
    currentPlaylist = null,
    setCurrentPlaylist = null,
){
    if(!end && isMount){
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            if(!loading && data && data.length){
                setLoading(true);
                
                const options = {
                    url: null,
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                    },
                    data: {
                        ids: null,
                        created_at: null,
                        genre_id: null,
                    }
                };

                if(direction === "users"){
                    options.url = 'api/users/spesific';
                    var ids = [];
                    data.map(function(singleData){
                        ids.push(singleData.id);
                    })
                    options.data.ids = ids;
                }else if(direction === "genreTracks"){
                    options.url = 'api/tracks/spesific';
                    options.data.created_at = data[data.length-1].created_at;
                    options.data.genre_id = genre_id;
                }else if(direction === "blogs"){
                    options.url = 'api/blogs/spesific';
                    options.data.created_at = data[data.length-1].created_at;
                }else if(direction === "gallery"){
                    options.url = 'api/gallery/spesific';
                    options.data.created_at = data[data.length-1].created_at;
                }

                axios(options)
                .then((res)=>{
                    var allData = data.concat(res.data);
                    if(allData.length !== data.length){
                        setLoading(false);
                        setData(allData);
                        if(direction === "genreTracks" ){
                            if(data.length === currentPlaylist.length){
                                for(var i = 0; i < data.length; i++){
                                    if(data[i] !== currentPlaylist[i]){
                                        localStorage.setItem('currentPlaylist', JSON.stringify(allData));
                                        setCurrentPlaylist(allData);
                                    }
                                }
                            }else{
                                localStorage.setItem('currentPlaylist', JSON.stringify(allData));
                                setCurrentPlaylist(allData);
                            }
                        }
                    }else{
                        setLoading(false);
                        setEnd(true);
                    }
                })
                .catch((err)=>{
                    setLoading(false);
                })
            }
        }
    }
}