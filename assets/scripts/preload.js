
var preload = cc.Class({
    extends: cc.Component,

    properties: {
        progressBar:cc.ProgressBar,
        diffSel:cc.Node,
        playerInfo:cc.Node,
        simpleBtn:cc.Button,
        ordinaryBtn:cc.Button,
        buttonAudio:cc.AudioClip,
    },

    
    start () {
        cc.game.addPersistRootNode(this.playerInfo);
        cc.director.preloadScene("game",()=>{
            this.progressBar.node.getChildByName("fileName").getComponent(cc.Label).string = "加载场景中..."
        },loaded = (err) =>{
            if(err){
                this.progressBar.node.getChildByName("fileName").getComponent(cc.Label).string += `错误(${error})`;
            }
            cc.resources.preloadDir(`textures`,cc.SpriteFrame,(finish,total,latestItem)=>{
                progressNum = (finish / total).toFixed(2);
                //console.log(progressNum);
                //console.log((progressNum*100).toFixed(0));
                this.progressBar.progress = progressNum;
                this.progressBar.node.getChildByName("progressNum").getComponent(cc.Label).string = `${30 + Number((progressNum * 70).toFixed(0))}%`;
                this.progressBar.node.getChildByName("fileName").getComponent(cc.Label).string = `(${latestItem.info.path})`;
            },
            (error,item)=>{
                if(error){
                    this.progressBar.node.getChildByName("fileName").getComponent(cc.Label).string += `错误(${error})`;
                }
                else {
                    this.progressBar.node.getChildByName("fileName").getComponent(cc.Label).string = `加载完毕！`;
                    this.scheduleOnce(()=>{
                        this.progressBar.node.active = false;
                        this.diffSel.active = true;
                        this.diffSel.getComponent(cc.Animation).play();
                    },0.7)
                }
    
            })
        })
        
        
    },

    diffSelBtnFunc(event,diff){
        
        console.log(diff)
        this.playerInfo = cc.director.getScene().getChildByName("playerInfo");
        this.playerInfo.getComponent("playerInfo").mode = diff;
        cc.audioEngine.play(this.buttonAudio,false,1);
        cc.director.loadScene("game");
        
    },
    // update (dt) {},
});