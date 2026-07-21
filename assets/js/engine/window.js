class SoilWindow{


constructor(element){

this.element=element;

this.open();


}


open(){

this.element.classList.add(
"active"
);

}


}


document
.querySelectorAll(".window")
.forEach(
window => new SoilWindow(window)
);