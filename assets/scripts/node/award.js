// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let award = cc.Class({
    extends: cc.Component,

    properties: {
        award:cc.Node,
        colorArr:undefined,
        colorArrIdx:0,
        touched:false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const game = cc.find("Canvas").getComponent("game");
        this.colorArr = [[255,0,0],[0, 255, 255],[0, 255, 0],[255, 235, 4],[255, 127, 0]];
        this.schedule(()=>{
            let idx = this.colorArr[this.colorArrIdx];
            this.award.color = new cc.Color(idx[0],idx[1],idx[2]);
            this.colorArrIdx++;
            if(this.colorArrIdx == this.colorArr.length)this.colorArrIdx = 0;
        },0.1)
        this.award.on(`touchstart`,function(event){
            game.awardNum++;
            game.audioControl.playSound("award");
            this.touched = true;
            this.award.off(`touchstart`)
            cc.tween(this.award)
            .to(0.5,{scaleX:0.5,scaleY:1.5})
            .to(0.5,{scaleX:1.5,scaleY:0.5})
            .to(0,{scale:1})
            .call(()=>{
                this.award.getComponent(cc.Sprite).spriteFrame = null;
                let label = this.award.getChildByName("New Label");
                if(Math.round(Math.random())){
                    game.scoreUpdate(20);
                    label.getComponent(cc.Label).string = "point!";
                
                }  
                else{
                    game.timeUpdate();
                    label.getComponent(cc.Label).string = "time!";
                
                };
                cc.tween(label)
                .to(1,{opacity:0})
                .call(()=>this.award.destroy(),this)
                .start()
               
                },this)
            .start();
        },this)
            
    },

   

    // update (dt) {},
});
module.exports = award;