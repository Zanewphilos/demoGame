// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const game = require("./game");

cc.Class({
    extends: cc.Component,

    properties: {
        collider:cc.Node,
        XVolocity:undefined,
        YVolocity:undefined,
        turnToX:undefined,
        turnToY:undefined,
        game:undefined,
    
        touchListen:true,
        contactListen:true,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.game = cc.find("Canvas").getComponent("game");
        let num = 30 + Math.floor(Math.random() * 4) * 50;
        this.XVolocity = this.speedInInterval(num);
        this.YVolocity = this.speedInInterval(num);
        this.turnToX = this.XVolocity;
        this.turnToY = this.YVolocity;
        cc.tween(this.collider)
        
        .repeatForever(cc.tween().by(1,{position:cc.v2(this.XVolocity,this.YVolocity)}))
        .tag(1)
        .start();

        this.collider.on(`touchstart`,function(event){
            if(this.touchListen){
                this.touchListen = false;
                this.collider.getComponent(cc.CircleCollider).enabled = false;
                console.log(this.collider.color)
                this.game.wrongTouch();
                cc.Tween.stopAllByTarget(this.collider);
                let orignScale = this.collider.scale;
                cc.tween(this.collider)
                .to(0.1,{scale:2})
                .by(0.05,{x:-10})
                .by(0.05,{x:20})
                .by(0.05,{x:-20})
                .by(0.05,{x:20})
                .by(0.05,{x:-20})
                .by(0.05,{x:20})
                .by(0.05,{x:-20})
                .by(0.05,{x:20})
                .by(0.05,{x:-20})
                .by(0.05,{x:20})
                .by(0.05,{x:-20})
                .by(0.05,{x:20})
                .by(0.05,{x:-20})
                .by(0.05,{x:20})
                .by(0.05,{x:-20})
                .by(0.05,{x:10})
                .to(0.1,{scale:orignScale})
                .call(()=>{
                    this.collider.getComponent(cc.CircleCollider).enabled = true;
                    this.touchListen = true;
                    if(this.game.contactListen){
                        cc.tween(this.collider)
                        .tag(1)
                        .repeatForever(cc.tween().by(1,{position:cc.v2(this.turnToX,this.turnToY)}))
                        .start();
                    }
                })
                
                .start();
            }
        },this)
    },

    start () {
        
    },

    update (dt) {
    
    },

    speedInInterval(num){
        let result = Math.random() > 0.5 ? +num : -num;
        return result;
    },


    onCollisionEnter: function (other, self){
        if(this.game.contactListen){
            if(this.turnToX){
                this.XVolocity = this.turnToX;
                this.YVolocity = this.turnToY;
            }
            let selfX = this.XVolocity > 0;
            let selfY = this.YVolocity > 0;
            let signumX = this.XVolocity < 0 ? +Math.abs(this.XVolocity) : -Math.abs(this.XVolocity);
            let signumY = this.YVolocity < 0 ? +Math.abs(this.YVolocity) : -Math.abs(this.YVolocity);
            if(other.node.name == "wall"){
                this.contactListen = false;
                //防止刚体与墙重叠时被其他刚体撞击导致的刚体穿透
                this.turnToX = other.size.height == 1680 ? signumX : this.XVolocity; 
                this.turnToY = other.size.height == 25 ? signumY : this.YVolocity;
                //左右两面墙翻转y轴，上下两面墙翻转y轴
                cc.Tween.stopAllByTarget(this.collider);
            cc.tween(this.collider)
            .repeatForever(cc.tween().by(1,{position:cc.v2(this.turnToX,this.turnToY)}))
            .tag(1)
            .start();
            }
            else if(other.node.name == "collider" && this.contactListen){
                let otherX;
                let otherY;
                otherX = other.node.getComponent("collider").XVolocity > 0;
                otherY = other.node.getComponent("collider").YVolocity > 0;
                if(otherX === selfX && otherY === selfY ){
                    this.turnToX = this.XVolocity;
                    this.turnToY = this.YVolocity;
                }
                else{
                    this.turnToX = otherY == selfY ? signumX: this.XVolocity;
                    this.turnToY = otherY == selfY ? this.YVolocity: signumY; 
                }
                //两球拥有不同正负的y值时翻转y值的正负，同正负则x值不变.
            cc.Tween.stopAllByTarget(this.collider)
            cc.tween(this.collider).repeatForever(cc.tween().by(1,{position:cc.v2(this.turnToX,this.turnToY)}))
            .tag(1)
            .start();
            }
        }
    },

    onCollisionExit: function (other, self) {
        this.XVolocity = this.turnToX;
        this.YVolocity = this.turnToY;
        if(other.node.name == "wall")this.contactListen = true;
        
        
    },
    // onBeginContact: function (contact, selfCollider, self) {
        
    //     let this.turnToX;
    //     let this.turnToY;
    //     let selfX = this.XVolocity > 0;
    //     let selfY = this.YVolocity > 0;
    //     let signumX = this.XVolocity < 0 ? +Math.abs(this.XVolocity) : -Math.abs(this.XVolocity);
    //     let signumY = this.YVolocity < 0 ? +Math.abs(this.YVolocity) : -Math.abs(this.YVolocity);
    //     if(self.node.name == "wall"){
    //         this.contactListen = false;
    //         //防止刚体与墙重叠时被其他刚体撞击导致的刚体穿透
    //         this.turnToX = self.size.height == 1680 ? signumX : this.XVolocity; 
    //         this.turnToY = self.size.height == 25 ? signumY : this.YVolocity;
    //         //左右两面墙翻转y轴，上下两面墙翻转y轴
    //         this.XVolocity = this.turnToX;-
    //     this.YVolocity = this.turnToY;
    //     cc.tween(this.collider).repeatForever(cc.tween().by(1,{position:cc.v2(this.XVolocity,this.YVolocity)})).start();
    //     }
    //     else if(self.node.name == "collider" && this.contactListen){
    //         let otherX;
    //         let otherY;
    //         otherX = self.node.getComponent("collider").XVolocity > 0;
    //         otherY = self.node.getComponent("collider").YVolocity > 0;
    //         if(otherX === selfX && otherY === selfY ){
    //             this.turnToX = this.XVolocity;
    //             this.turnToY = this.YVolocity;
    //         }
    //         else{
    //             this.turnToX = otherX == selfX ? signumX: this.XVolocity;
    //             this.turnToY = otherY == selfY ? signumY: this.YVolocity; 
    //         }
    //         //两球拥有不同正负的x值时翻转x值的正负，同正负则x值不变,y轴同理。
    //         this.XVolocity = this.turnToX;
    //     this.YVolocity = this.turnToY;
    //     cc.tween(this.collider).repeatForever(cc.tween().by(1,{position:cc.v2(this.XVolocity,this.YVolocity)})).start();
    //     }
    //     if(this.this.turnToX)console.log("catch")
    // },


    // onEndContact: function (contact, selfCollider, self) {
    //     if(self.node.name == "wall")this.contactListen = true;
    // },
    

    
    


});
