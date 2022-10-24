const{json,select,selectAll,geoOrthographic,geoPath,geoGraticule}=d3;
json("./js/custom.geo.json").then(data=>init(data));

var geoJson,globe,projection,path,graticule,infoPanel, isMouseDown=false,rotation={x:0,y:0};

const globeSize={
    w:375,
    h:document.getElementById("body").clientHeight
};

function init(data){
    geoJson=data;
    drawGlobe();
    //drawGraticule();
    //renderInfoPanel();
    //createHoverEffect();
    //createDraggingEvents();
};

function drawGlobe(){
    globe=select("#geoMap").append("svg")
    .attr("class","figure")
    .attr("width",window.innerWidth)
    .attr("height",window.innerHeight);

    projection=geoOrthographic().fitSize([globeSize.w,globeSize.h],geoJson);

    path=geoPath().projection(projection);

    globe.selectAll("path").data(geoJson.features).enter().append("path")
    .attr("d",path)
    .style("fill","#33415c")
    .style("stroke","#060a0f")
    .attr("class","country");
}

function drawGraticule(){
    
    graticule=geoGraticule();

    globe.append("path")
    .attr("class","graticule")
    .attr("d",path(graticule()))
    .style("fill","none")
    .style("stroke","#232323");
}


function renderInfoPanel(){
    infoPanel=select("body").append("article").attr("class","info");
}

function createHoverEffect(){
    globe.selectAll(".country")
    .on("mouseover",function(e,d){
        const {name,economy}=d.properties;
        infoPanel.html(`<h1>${name}</h1><hr><p>${economy}</P>`);
        globe.selectAll(".country").style("fill","#33415c")
        .style("stroke","#060a0f");
        select(this).style("fill","#6ea9ff").style("stroke","white");
    });
}

function createDraggingEvents(){
    globe
    .on("mousedown",()=>isMouseDown=true)
    .on("mouseup",()=>isMouseDown=false)
    .on("mousemove",(e)=>{

        if(isMouseDown){
            const {movementX,movementY}=e;

            rotation.x+=movementX/2;
            rotation.y-=movementY/2;
    
            projection.rotate([rotation.x,rotation.y]);
            selectAll(".country").attr("d",path);
            selectAll(".graticule").attr("d",path(graticule()));
        }

    });
}