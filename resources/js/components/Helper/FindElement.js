export default function FindElement(e){
    var element = e.target.tagName.toLowerCase();
    if(element === "button"){
        return e.target;
    }else if(element === "svg"){
        return e.target.parentNode;
    }else if(element === "path"){
        return e.target.parentNode.parentNode;
    }
}