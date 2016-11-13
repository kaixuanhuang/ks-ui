/**
 * Created by huangsihuan on 2016/11/12.
 */


let  $$ForceReflowFactory = ['$document', $document => {
    let forceReflowService = ()=>{
        return $document[0].body.clientWidth + 1;
    }
    return forceReflowService;
}];

export default $$ForceReflowFactory;
