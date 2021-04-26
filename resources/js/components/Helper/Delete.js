export default function Delete(delete_id, direction, setLoading, headed = false){
    if(delete_id){
        setLoading(true);
        const options = {
            url: 'api/delete',
            method: 'POST',
            data:{
                delete_id: delete_id,
                direction: direction
            }
        };
        axios(options)
        .then((res)=>{
            if(res.data === "deleted"){
                if(headed){
                    window.location.href = 'http://localhost:8000/';
                }else{
                    window.location.reload();
                }
            }
            setLoading(false);
        })
        .catch((err)=>{
            setLoading(false);
        })
    }
}