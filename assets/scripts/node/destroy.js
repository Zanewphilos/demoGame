// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        error:false
    },

   
    // onLoad () {},

    start () {
        this.error = cc.find("Canvas").getComponent("game").countdownNum > 0;
    },

    onCollisionEnter: function (other, self){
        if(this.error){
            console.log(other)
        }
        console.log("success")
        other.node.destroy();

    }
    // update (dt) {},
});
