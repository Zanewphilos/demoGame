// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        award:cc.AudioClip,
        button:cc.AudioClip,
        score:cc.AudioClip,
        target:cc.AudioClip,
        wrong:cc.AudioClip,
        bgm1:cc.AudioClip,
        bgm2:cc.AudioClip,
        bgm3:cc.AudioClip,
        bgmList:[],
        bgmId:undefined,
    },

    onLoad(){
        console.log("audio!")
        this.bgmList = [this.bgm1,this.bgm2,this.bgm3];
    },

    playSound(soundName){
        let sound = this[soundName];
        cc.audioEngine.play(sound,false,1);
    },

    bgmPlay(){
        this.bgmId = cc.audioEngine.play(this.bgmList[0],false,0.8);
        this.setCallback();
    },

    setCallback(){
        cc.audioEngine.setFinishCallback(this.bgmId,()=>{
            let next = this.bgmList.shift();
            this.bgmList.push(next);
            this.bgmId = cc.audioEngine.play(this.bgmList[0],false,0.8);
            this.setCallback();
        })
    },

    bgmStop(){
        cc.audioEngine.stop(this.bgmId);
    }
    
    // update (dt) {},
});
