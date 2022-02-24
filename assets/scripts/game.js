
let game = cc.Class({
    extends: cc.Component,

    properties: {
        CanvasAnimation:cc.Animation,
        boundBox:cc.Node,
        countdown:cc.Node,
        scoreNode:cc.Node,
        Collider:cc.Prefab,
        target:cc.Prefab,
        award:cc.Prefab,
        bottomWall:cc.Node,
        progressBar:cc.Node,
        guide:cc.Node,
        scorePanel:cc.Node,
        audioControlNode:cc.Node,
        audioControl:undefined,
        playerInfo:undefined,
        scoreGetNumArr:[],
        targetArr:[],
        targetNum:3,
        life:3,

        score:0,
        finishNum:0,
        awardNum:0,
         
        contactListen:true,
        timerCallback:undefined,

        mode:undefined,
        iconSize:undefined,
        iconTotalNum:undefined,
        currentTime:undefined,
        countdownNum:undefined,

        lifeAnimation:undefined,
        targetAnimation:undefined,

        awardGenerated:false,
        phaseFinish:false,
    },
    
    onLoad(){
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit | 
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit;

        this.audioControl = this.audioControlNode.getComponent("audioControl");
        this.playerInfo = cc.director.getScene().getChildByName("playerInfo");
        this.mode = Number(this.playerInfo.getComponent("playerInfo").mode);
        cc.game.addPersistRootNode(this.playerInfo);
        //collisionSet
        
    },

    start () {
        this.audioControl.bgmPlay();
    },
    

    gameBegin(){
        this.guide.getChildByName("begin").getComponent(cc.Button).interactable = false;
        this.audioControl.playSound("button");
        this.scheduleOnce(()=>{
            this.guide.active = false;
            this.init();
        },1)
    },


    init(){
        cc.resources.loadDir("textures/icon",cc.SpriteFrame,null,(err,textures)=>{
            this.awardGenerated = false;
            this.phaseFinish = false;
            this.progressBar.getComponent(cc.ProgressBar).progress = 0;
            this.CanvasAnimation.setCurrentTime(0,"targetChange");
            this.modeParm(this.mode);
            let targetNum = this.targetNum;
            this.contactListen = true;
            this.bottomWall.active = true;
            cc.director.getPhysicsManager().gravity = cc.v2();

            let texturesSet = new Set();
            while(texturesSet.size <= this.iconTotalNum){
                let randomNum = Math.floor(Math.random()*textures.length);
                texturesSet.add(randomNum);
            }

            let colorArr = [
                [255,255,255],[70,130,138],[0,139,139],[255,160,122],
                [238,220,130],[205,155,155],[238,99,99],[238,154,0],
                [139,90,43],[174,238,238],[238,203,173],[139,137,137],
                [224,238,224],[154,192,205],[255,255,255],[122,103,238],
                [0,250,154],[0,139,139],[255,110,180],[205,181,205],
                [255,255,0],[165,42,42],[255,250,205],[221,211,211],
                [255,228,25],[144,238,144],[220,220,220],[240,255,255]
            ];
        
            for(let value of texturesSet){
                let randomNum = Math.floor(Math.random()*colorArr.length);
                let resultRGB = colorArr[randomNum];
                colorArr.splice(colorArr[randomNum],1)
                if(targetNum > 0){
                    let instance = cc.instantiate(this.target)
                    instance.scale = this.iconSize;
                    let randomX = -this.boundBox.width/2 + Math.ceil(Math.random()*this.boundBox.width);
                    let randomY = -this.boundBox.height/2 + Math.ceil(Math.random()*this.boundBox.height);
                    instance.position = cc.v2(randomX,randomY);
                    instance.getComponent(cc.Sprite).spriteFrame = textures[value];
                    instance.color = new cc.Color(resultRGB[0],resultRGB[1],resultRGB[2]);
                    targetNum--;
                    this.boundBox.addChild(instance);
                    this.targetArr.push(instance);
                }

                for(let idx = 0;idx < 7;idx ++){
                    let instance = cc.instantiate(this.Collider);
                    instance.scale = this.iconSize;
                    let randomX = -this.boundBox.width/2 + Math.ceil(Math.random()*this.boundBox.width);
                    let randomY = -this.boundBox.height/2 + Math.ceil(Math.random()*this.boundBox.height);
                    instance.position = cc.v2(randomX,randomY);
                    instance.getComponent(cc.Sprite).spriteFrame = textures[value];
                    instance.color = new cc.Color(resultRGB[0],resultRGB[1],resultRGB[2]);
                    this.boundBox.addChild(instance);
                }
            }

            
        })




        this.timerCallback = () =>{
            this.currentTime--;
            this.awardGenerate();
            if(this.currentTime == 0){
                this.wrongTouch();
                if(this.life != 0)this.restart(false);
            }
            
            if(this.countdown.getChildByName("first").getComponent(cc.Label).string != (this.currentTime - this.currentTime % 10) / 10){
                let firstLabel = (this.currentTime - this.currentTime % 10) / 10;
                this.CanvasAnimation.playAdditive("countdown10");
                this.scheduleOnce(()=>this.countdown.getChildByName("first").getComponent(cc.Label).string = firstLabel,0.3);
                
            }
            this.CanvasAnimation.playAdditive("countdown1");
            let secondLabel = this.currentTime % 10;
            this.scheduleOnce(()=>this.countdown.getChildByName("second").getComponent(cc.Label).string = secondLabel,0.3);
         },

         this.schedule(this.timerCallback,1);
    },
    
    restart(over){
        if(!this.phaseFinish){
            this.phaseFinish = true;
            this.unschedule(this.timerCallback);
            this.contactListen = false;
            this.contactListen = false;
            
            cc.Tween.stopAllByTag(1);
            cc.director.getPhysicsManager().gravity = cc.v2(0,-480);
            this.bottomWall.active = false;
            this.scheduleOnce(()=>{
                for(let i = 0;i<this.targetArr.length;i++){
                    this.boundBox.removeChild(this.targetArr[i]);
                }
                this.progressBar.getChildByName("bar").removeAllChildren();
                if(over){
                    this.scorePanel.getComponent("scorePanel").scorePanelUpdate(this.score,this.finishNum,this.awardNum);
                }
                else{
                    this.init();
                }
            },4);
        }
    },

    awardGenerate(){
        if(!this.awardGenerated){
            let floatTime = 4;
            if(Math.random() <= (1/(this.countdownNum - floatTime)) * ((this.countdownNum - floatTime) - (this.currentTime - floatTime))){
                let instance = cc.instantiate(this.award);
                instance.scale = this.iconSize;
                let startY;
                let endY;
                let easeMode = [`quintIn`,`cubicOut`,`cubicInOut`,`quartInOut`];
                let startState = Math.round(Math.random());
                let endState = Math.round(Math.random());
                let randomStartY = Math.ceil((Math.random() * (this.boundBox.height/2)))
                let randomEndY = Math.ceil((Math.random() * (this.boundBox.height/2)))
                startY = startState? +randomStartY: -randomStartY;
                endY = endState? +randomEndY: -randomEndY;
                let startX = this.boundBox.convertToNodeSpaceAR(cc.v2(0,0));
                let endX = this.boundBox.convertToNodeSpaceAR(cc.v2(this.CanvasAnimation.node.width,0));
                instance.position = cc.v2(startX.x,startY);
                this.boundBox.addChild(instance);
                cc.tween(instance)
                .to(floatTime,{x:endX.x,y:endY},{easing:easeMode[Math.ceil(Math.random() * easeMode.length)]})
                .call(()=>{
                    if(!instance.getComponent("award").touched){
                        instance.destroy();
                    }
                })
                .start()
                this.awardGenerated = true;
            }
        }
    },
    
    modeParm(mode){
        this.targetNum = 3;
        if(mode == 1){
            this.iconSize = 1.2;
            this.iconTotalNum = 7;
            this.currentTime = 16;
        }
        else if(mode == 2){
            this.iconSize = 1;
            this.iconTotalNum = 12;
            this.currentTime = 21;
        }
        else if (mode == 3){
            this.iconSize = 0.8;
            this.iconTotalNum = 24;
            this.currentTime = 31;
        }
        this.countdownNum = this.currentTime;
    },

    scoreUpdate(num){
        if(!this.scoreGetNumArr[0]){
            this.scoreGetNumArr.push(num)
            let getNumNode = this.scoreNode.getChildByName("getNum");       
            let scoreNumNode = this.scoreNode.getChildByName("scoreNum");
    
            let action = cc.tween(getNumNode)
            .call(()=>{
                let latestValue = this.scoreGetNumArr[0];
                getNumNode.getComponent(cc.Label).string = `+${latestValue}`;
                let lastScore = Number(scoreNumNode.getComponent(cc.Label).string);
                this.schedule(()=>{
                    scoreNumNode.getComponent(cc.Label).string = ++lastScore;
                },
                ((2/latestValue).toFixed(1)), latestValue - 1, 0);
            },this)
            .to(0,{x:getNumNode.x + 60,opacity:0})
            .to(0.5,{x:getNumNode.x,opacity:255})
            .to(1)
            .to(1,{opacity:0})
            .call(()=>{
                this.score += this.scoreGetNumArr.shift();
                console.log(`score:`+this.score);
                if(this.scoreGetNumArr[0])action.start();
            })

            action.start();
        }
        else{
            this.scoreGetNumArr.push(num);
        }
         
    },

    timeUpdate(){
        this.CanvasAnimation.playAdditive("getTime");
    },

    lifeAniPause(){
        if(this.life == 2 &&  Math.round(this.lifeAnimation.time) == 2  || this.life == 1 && Math.round(this.lifeAnimation.time) == 4){
            this.lifeAnimation.pause();
        }
        
    },
    targetAniPause(){
        if(this.targetNum == 2 &&  this.targetAnimation.time.toFixed(1) == 0.5  || this.targetNum == 1 && Math.round(this.targetAnimation.time) == 1){
            this.targetAnimation.pause();
        }
    },

    aniAddTime(){
        this.currentTime += 20;
    },


    wrongTouch(){
        this.audioControl.playSound("wrong");
        if(!this.phaseFinish){
            this.life--;
            console.log(this.life);
            if(!this.lifeAnimation){
                this.lifeAnimation = this.CanvasAnimation.playAdditive("lifeChange");
                
            }
            else if(this.lifeAnimation && this.lifeAnimation.isPaused){
                this.lifeAnimation.resume();
            }

            if(!this.life){
                this.restart(true);
        }
    }
    },

    rightTouch(target){
        if(!this.phaseFinish){
            this.targetNum--;
            this.audioControl.playSound("target");
            let positionX;
            let ProgressWidth = this.progressBar.width;
            let targetWidth = target.width;
            if(this.targetNum == 2){
                positionX = ProgressWidth * 0.3 - targetWidth/2;
            }
            else if(this.targetNum == 1){
                positionX = ProgressWidth * 0.6 - targetWidth/2;
            }
            else if(!this.targetNum){
                positionX = ProgressWidth - targetWidth/2;
            }
            let bar = this.progressBar.getChildByName("bar");
            let targetWorldPoint = this.boundBox.convertToWorldSpaceAR(target.position);
            let barLocalPoint = bar.convertToNodeSpaceAR(targetWorldPoint);
            target.parent = bar;

            let tween = cc.tween(target)
            .to(0,{position:barLocalPoint})
            .to(1,{x:positionX,y:bar.y},{easing:`expoInOut`})
            .call(()=>{
                if((positionX + targetWidth/2) /0.3 == ProgressWidth){
                    this.targetAnimation = this.CanvasAnimation.playAdditive("targetChange");
                    
                }
                else if(this.targetAnimation && this.targetAnimation.isPaused){
                    this.targetAnimation.resume();
                }
            },this)
            
            if(!this.targetNum){
                tween.call(()=>{
                    this.finishNum++;
                    this.restart(false);
                    this.scoreUpdate(3);
                    },
                    this);
        }
            tween.start()
    }
    },

    

});
module.exports = game;