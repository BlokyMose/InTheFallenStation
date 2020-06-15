import { sceneEvents } from "../events/EventsCenter";

export default class UICard{
    constructor(scene){
        this.name = "Card";
        this.text = "▭";

        this.type = "item";
        this.desc = ""; //fill the same text in desc and descLong. Do it manually in game Scene
        this.descLong = "";
        this.title ="";

        this.scene = scene;

        this.isExist;
        this.allMessages;
        this.UIText;


        document.querySelector("#indexNotes-h1").setAttribute("style","opacity:0;");
        document.querySelector("#indexNotes-p").setAttribute("style","opacity:0;");

        sceneEvents.on("insert-item-ui",this.AddUIPhone,this);

    }

    AddUIPhone({
        name=this.name,
        x=0, 
        y=0, 
        text=this.text,
        textStyle={},
        extra={
            title:"",
            desc:"",
        }
    }){
        if(name==this.name){
            this.text = text;
            this.isExist = true;
    
            this.UIText = this.scene.add.text(x, y, "| " + this.text, textStyle).setOrigin(0).setInteractive();
            this.UIText.setColor("LimeGreen");
            this.UIText.on('pointerover', function (pointer) { this.OpenNote(true); }, this);
            this.UIText.on('pointerout', function (pointer) { this.OpenNote(false); }, this);
            
            this.title = extra["title"];
            this.desc = extra["desc"];
            console.log("TJIANG PACCE: "+extra["title"]);
            sceneEvents.on('destroy-item-ui',this.Destroy,this);
        }
    }

    OpenNote(boolValue){
        if(boolValue){
            document.querySelector("#indexNotes-h1").textContent = this.title;
            document.querySelector("#indexNotes-p").textContent = this.desc;
            document.querySelector("#indexNotes-h1").setAttribute("style","opacity:1;");
            document.querySelector("#indexNotes-p").setAttribute("style","opacity:1;");
            
            this.UIText.setColor("Green");
        }else{
            document.querySelector("#indexNotes-h1").setAttribute("style","opacity:0;");
            document.querySelector("#indexNotes-p").setAttribute("style","opacity:0;");
            document.querySelector("#indexNotes-h1").textContent = "";
            document.querySelector("#indexNotes-p").textContent = "";
            this.UIText.setColor("LimeGreen");
        }

    }

    Destroy(name){
        if(name==this.name){
            this.isExist = false;
            this.UIText.destroy();
        }
    }
}