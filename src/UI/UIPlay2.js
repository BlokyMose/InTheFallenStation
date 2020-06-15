import { CST } from "../CST";
import { sceneEvents } from "../events/EventsCenter";
import UITorch from "./UITorch";
import UIWound from "./UIWound";
import UIPhone from "./UIPhone";
import UINotes from "./UINotes";
import UIGun from "./UIGun";
import UIInventory from "./UIInventory";
import UICard from "./UICard";

let UITextBox;
let UITextDesc;

let healthPlayer;
let healthCynthia;
let healthLot;

let timerEvent;

let _UITorch;
let _UIWound;
let _UIPhone;
let _UIGun;
let _UIInventory;
let _UICard;
let tsTextDesc = {
    fontSize: '20px',
    fontFamily: 'Candara',
    color: 'darkgray',
    lineSpacing: 4,    
    align: "right",
    // backgroundColor: '#ff00ff',
    // shadow: {color: '#000000',fill: true,offsetX: 2,offsetY: 2,blur: 8}
};
let tsTextTorch = {
    fontSize: '20px',
    fontFamily: 'Courier',
    color: 'LimeGreen',
    align: 'left',
    lineSpacing: 5,    
    // backgroundColor: "#a0a0a0",
    // shadow: {color: '#000000',fill: true,offsetX: 2,offsetY: 2,blur: 8}
};




export default class UIPlay2 extends Phaser.Scene{
    constructor(){
        super({key:CST.SCENES.UIPlay2})
    }

    init({
        iHealthPlayer=100,
        iHealthCynthia=100,
        iHealthLot=100,
    }){
        healthPlayer=iHealthPlayer;
        healthCynthia=iHealthCynthia;
        healthLot=iHealthLot;
        console.log("UIPLAY2");   
    }

    preload(){
        this.load.image('UIDarknessOuter', "assets/img/UI/darknessOuter.png");
        this.load.image("UIDarknessInner","assets/img/UI/darknessInner.png");
    }

    create(){       
        this.input.setDefaultCursor('url(assets/cur/dotDark.cur), pointer');

        UITextBox = this.add.rectangle(0,520,800,80,0x0a0a0a,1).setOrigin(0,0);//0x0a0a0a //0x808080
        UITextDesc = this.add.text(660,540,"",tsTextDesc).setOrigin(0,-0);
        let UIGroup = this.add.group({
            classType: Phaser.GameObjects.Graphics
        });
        UIGroup.add(UITextBox);

        sceneEvents.on('ui-text-desc-change', ChangeUITextDesc,this);
        sceneEvents.on('ui-text-desc-reset', ResetUITextDesc,this);
        sceneEvents.on('decrease-health-player', DecreaseHealthPlayer,this);

        //Default for all tools and items
        //Add new tools by making Class, InsertToInventory(), 
        //Insert tools by emit an event to call InsertToInventory method in UIPlay2, here
        _UIWound= new UIWound(this,"Wound",tsTextTorch,0,540);
        _UITorch = new UITorch(this, "UIDarknessInner", "UIDarknessOuter",);
        _UIPhone = new UIPhone(this);
        _UIGun = new UIGun(this);
        _UICard = new UICard(this);

        //Initial tools:
        this.AddInventory();
        this.InsertTorchToInventory();
        this.InsertGunToInventory();
        this.InsertPhoneToInventory();
        this.InsertCardToInventory({title: "yeyCard", desc: 'Desc'});

        document.querySelector("#indexPlayerHealth").textContent = "You ✙ "+healthPlayer;
        document.querySelector("#indexCynthiaHealth").textContent = "Cynthia ✙ "+healthCynthia;
        document.querySelector("#indexLotHealth").textContent = "Lot ✙ "+healthLot;

        sceneEvents.on('timer-event',DecreaseHealth)

    }

    AddInventory() {
        _UIInventory = new UIInventory(this, "Bag", tsTextTorch, 0, 570);
    }

    InsertGunToInventory() {
        _UIInventory.InsertItem({
            name: _UIGun.name,
            type: _UIGun.type,
            desc: _UIGun.desc,
            descLong:_UIGun.descLong
        });
    }

    InsertPhoneToInventory() {
        _UIInventory.InsertItem({
            name: _UIPhone.name,
            type: _UIPhone.type,
            desc: _UIPhone.desc,
            descLong:_UIPhone.descLong
        });
    }

    InsertTorchToInventory() {
        _UIInventory.InsertItem({
            name: _UITorch.name,
            type: _UITorch.type,
            desc: _UITorch.desc,
            descLong:_UITorch.descLong
        });
    }

    InsertCardToInventory(extra){
        _UIInventory.InsertItem({
            name: _UICard.name,
            type: _UICard.type,
            desc:extra["desc"],
            descLong:extra["desc"],
            extra:extra["title"],
        });
    }

    DecreaseHealthTimer() {
        timerEvent = this.time.addEvent({
            //30min=>20.000ms; Must include eating food cna
            delay: 20000,
            loop: true,
            callback: DecreaseHealth,
        });
    }

    update(){

    }
}

function ChangeUITextDesc({
    text="?",
    color="darkgray",
}){
    UITextDesc.setColor(color);
    UITextDesc.setText([text]);
    UITextDesc.setFontStyle('italic');
}

function ResetUITextDesc(){
    UITextDesc.setText("");
    UITextDesc.setColor("darkgray");
    UITextDesc.setFontStyle("italic");
}

function DecreaseHealth(){
    DecreaseHealthPlayer(2);
    DecreaseHealthCynthia(2);
    DecreaseHealthLot(1);
}

function DecreaseHealthPlayer(damage){
    if(_UIWound.NotBleeding()){
        healthPlayer-=damage/2;
    } else{
        healthPlayer-=damage;
    }
    UpdateUIHealth();
}

function DecreaseHealthCynthia(damage){
    healthCynthia-=damage;
    UpdateUIHealth();
}
function DecreaseHealthLot(damage){
    healthLot-=damage;
    UpdateUIHealth();
}

function UpdateUIHealth(){
    // UITextHPPlayer.setText("You: "+healthPlayer);
    document.querySelector("#indexPlayerHealth").textContent = "You ✙ "+healthPlayer;
    document.querySelector("#indexCynthiaHealth").textContent = "Cynthia ✙ "+healthCynthia;
    document.querySelector("#indexLotHealth").textContent = "Lot ✙ "+healthLot;

    if(healthPlayer<=50){
        document.querySelector("#indexPlayerHealth").setAttribute("style","color:#ffd300;");

        if(healthPlayer<=25){
        document.querySelector("#indexPlayerHealth").setAttribute("style","color:#ff1a00;");

        }
    }
    if(healthCynthia<=50){
        document.querySelector("#indexCynthiaHealth").setAttribute("style","color:#ffd300;");
        if(healthCynthia<=25){
            document.querySelector("#indexCynthiaHealth").setAttribute("style","color:#ff1a00;");
        }
    }
    if(healthLot<=50){
        document.querySelector("#indexLotHealth").setAttribute("style","color:#ffd300;");
        if(healthLot<=25){
            document.querySelector("#indexLotHealth").setAttribute("style","color:#ff1a00;");
        }
    }

}


