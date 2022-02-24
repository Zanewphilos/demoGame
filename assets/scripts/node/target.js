// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


cc.Class({
    extends: cc.Component,

    properties: {
        target:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const game = cc.find("Canvas").getComponent("game");
        this.target.on(`touchstart`,function(event){
            this.target.off(`touchstart`)
            game.rightTouch(this.target);
        },this)
    },



    // update (dt) {},
});
