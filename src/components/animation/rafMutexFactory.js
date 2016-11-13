/**
 * Created by huangsihuan on 2016/11/12.
 */

let $$rAFMutexFactory = ['$$rAF', $$rAF=> {
    let rAFMutexService = ()=>{
        let passed = false;
        $$rAF(()=> {
            passed = true;
        });
        return fn=> {
            passed ? fn() : $$rAF(fn);
        };
    }
    return rAFMutexService;
}];

export default  $$rAFMutexFactory;
