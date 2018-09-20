

const ensurer=(function(){
    let binds=[]
    const maxInterval=100
    this.interval=maxInterval 
    this.timeout=null
    this.addEnsurer=(obj,ensureFunc,cb,interval,timeout)=>{
        if(interval&&interval<this.interval){
            this.interval=interval
        }
        binds.push({obj,ensureFunc,interval,cb,timeout})
        if(this.timeout===null){
            this.check()
        }
    }
    this.check=()=>{
        const toRemove=[]
        let index=binds.length
        while(index--){
            if(binds[index].ensureFunc(binds[index])){
                toRemove.push(index)
                binds[index].cb&&binds[index].cb()
            }
        }
        if(toRemove.length>0){
            for(let i of toRemove){
                binds.splice(i,1)
            }
            this.recalInterval()
        }
        if(binds.length>0){
            this.timeout=setTimeout(this.check,this.interval)
        }
        else{
            this.timeout=null
        }
    }
    this.recalInterval=()=>{
        this.interval=maxInterval
        for(let b of binds){
            if(b.interval&&b.interval<this.interval){
                this.interval=b.interval
            }
        }
    }
    return this
})();
export {ensurer}