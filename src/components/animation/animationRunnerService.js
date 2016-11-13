/**
 * Created by huangsihuan on 2016/11/12.
 */
let {noop} = angular;


const INITIAL_STATE = 0;
const DONE_PENDING_STATE = 1;
const DONE_COMPLETE_STATE = 2;

class Runner {
    constructor(){

    }

    setHost = host=>{ this.host = host || {};  }

    done = fn =>{
        if (this._state === DONE_COMPLETE_STATE) {
            fn();
        } else {
            this._doneCallbacks.push(fn);
        }
    }

    progress = noop;

    getPromise = ()=>{
        if (!this.promise) {
            let self = this;
            this.promise = $q(function(resolve, reject) {
                self.done(function(status) {
                    status === false ? reject() : resolve();
                });
            });
        }
        return this.promise;
   }

    then = (resolveHandler, rejectHandler)=>{
        return this.getPromise().then(resolveHandler, rejectHandler);
     }

    'catch' = handler=>{
        return this.getPromise()['catch'](handler);
     }

    'finally' = handler=>{
        return this.getPromise()['finally'](handler);
     }

    pause = ()=>{
        if (this.host.pause) this.host.pause();
    }

    resume=()=>{
        if (this.host.resume) this.host.resume();
    }

    end=()=>{
        if (this.host.end) this.host.end();
        this._resolve(true);
    }

    cancel=()=>{
        if (this.host.cancel) this.host.cancel();
        this._resolve(false);
    }

    complete = response =>{
        var self = this;
        if (self._state === INITIAL_STATE) {
            self._state = DONE_PENDING_STATE;
            self._runInAnimationFrame(function() {
                self._resolve(response);
            });
        }
    }

    _resolve = response=>{
        if (this._state !== DONE_COMPLETE_STATE) {
            forEach(this._doneCallbacks, function(fn) {
                fn(response);
            });
            this._doneCallbacks.length = 0;
            this._state = DONE_COMPLETE_STATE;
        }
   }
}

class AnimateRunner extends Runner{
    constructor(host){
        this.host = host;
        this.setHost(host);
        this._doneCallbacks = [];
        this._runInAnimationFrame = $$rAFMutex();
        this._state = 0;
    }

    all = (runners, callback)=>{
        let count = 0;
        let status = true;
        forEach(runners, runner=>{
            runner.done(onProgress);
        });

        let onProgress = response=>{
            status = status && response;
            if (++count === runners.length) {
                callback(status);
            }
        }
    }

}


$$AnimateRunnerFactory.$inject = ['$q', '$$rAFMutex'];
export default function $$AnimateRunnerFactory($q, $$rAFMutex){
    return AnimateRunner;
}
