// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        scorePannel:cc.Node,
        score:cc.Node,
        finish:cc.Node,
        award:cc.Node,
        AudioControlNode:cc.Node,
        AudioControl:undefined,
        scoreNum:undefined,
        finishMultiple:0.1,
        awardMulltiple:0.2,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.AudioControl = this.AudioControlNode.getComponent("audioControl");
    },


    scorePanelUpdate(score,finishNum,awardNum){
        this.scorePannel.active = true;
        this.scoreNum = score;
        this.score.getComponent(cc.Label).string = score;
        let finishMultipleResult = 1 + this.finishMultiple * finishNum;
        this.finish.getComponent(cc.Label).string = `score × ` + finishMultipleResult;
        cc.tween(this.finish)
        .to(2,{opacity:255})
        .call(this.scoreUpdate(finishMultipleResult),this)
        .call(()=>{
            let awardMulltipleResult =  1 + this.awardMulltiple * awardNum;
            this.award.getComponent(cc.Label).string = `score × ` + awardMulltipleResult;
            cc.tween(this.award)
            .to(2,{opacity:255})
            .call(this.scoreUpdate(awardMulltipleResult),this)
            .start()
        },)
        .start()
        console.log(score,finishNum,awardNum);
    },

    scoreUpdate(multiple){
        this.AudioControl.playSound("score");
        let scoreResult = Math.round(this.scoreNum * multiple);
        let diff = scoreResult - this.scoreNum;
        this.scoreNum = scoreResult;
        this.schedule(()=>{
            let currentScore = Number(this.score.getComponent(cc.Label).string);
            currentScore++
            this.score.getComponent(cc.Label).string = currentScore; 
        }
        ,(2/diff).toFixed(1),diff - 1,0)
    },

    remake(){

        this.scheduleOnce(()=>{
            this.AudioControl.bgmStop();
            cc.director.loadScene("preload");
    },0.5);
    }
});
