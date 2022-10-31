import CovidService from "./CovidService.js";
const covid=new CovidService();
var btnOn=[];
const btn1=document.getElementById("btn-group-1");
const btn2=document.getElementById("btn-group-2");
const btn3=document.getElementById("btn-group-3");

drawButtons(btn1);
drawButtons(btn2);
drawButtons(btn3);

draw();

async function drawButtons(btnx){

    const paises= await  covid.getCountries();

    paises.forEach(pais => {
        const btn=document.createElement("button");
        btn.type="button";
        btn.setAttribute("activo",false);
        btn.setAttribute("grafica",btnx.id);
        btn.id=pais._id;
        btn.innerHTML=`${pais.location}`;
        if(pais.location=="Colombia"){
            btn.className="btn btn-outline-light active";
            btnOn.push(btn);
        }else{
            btn.className="btn btn-outline-light";
        }

        btn.addEventListener("click",async()=>{
            const id=btn.id;
            const grafica=btn.getAttribute("grafica");

            const data=await covid.getData(id);

            let date=[];
            let datos=[];
            let idChart="";

            if(grafica=="btn-group-1"){
                data.forEach(e => {
                    date.push(e.date);
                    datos.push(e.new_deaths);
                });
                idChart="graph_1";
                btn.classList.add("active");
                btnOn[0].classList.remove("active");
                btnOn[0]=btn;
                updateChart(idChart,data,renderDeaths);
            }else if(grafica=="btn-group-2"){
                data.forEach(e => {
                    date.push(e.date);
                    datos.push(e.new_cases);
                });
                idChart="graph_2";
                btn.classList.add("active");
                btnOn[1].classList.remove("active");
                btnOn[1]=btn;
                updateChart(idChart,data,renderCases);
            }else if(grafica=="btn-group-3"){
                data.forEach(e => {
                    date.push(e.date);
                    datos.push(e.new_vaccinations);
                });
                idChart="graph_3";
                btn.classList.add("active");
                btnOn[2].classList.remove("active");
                btnOn[2]=btn;
                updateChart(idChart,data,renderVaccination);
            }

        });

        btnx.appendChild(btn);
    });
}

async function draw(){

    const data=await covid.getData("COL")
    renderDeaths(data);
    renderCases(data);
    renderVaccination(data);
}

function renderDeaths(datos){
    const dates=(datos)=>{
        var date=[];
        datos.forEach(e => {
            date.push(e.date);
        });
        return date;
    }

    const muertes=(datos)=>{
        var d=[];
        datos.forEach(e => {
            d.push(e.new_deaths);
        });
        return d;
    }

    const data={
        labels:dates(datos),
        datasets:[{
            data:muertes(datos),
            pointBorderWidth:2
        }]
    };

    const options={
        plugins:{
            legend: { display: false },
            zoom:{
                zoom:{
                    wheel:{
                        enabled:true
                    }
                }
            }
        }
    };

    new Chart("graph_1",{type:"line",data},options);

}

function renderCases(datos){
    const dates=(datos)=>{
        var date=[];
        datos.forEach(e => {
            date.push(e.date);
        });
        return date;
    }

    const casos=(datos)=>{
        var d=[];
        datos.forEach(e => {
            d.push(e.new_cases);
        });
        return d;
    }

    const data={
        labels:dates(datos),
        datasets:[{
            data:casos(datos),
            pointBorderWidth:2
        }]
    };

    const options={
        plugins:{
            legend:{display:false},
            zoom:{
                zoom:{
                    wheel:{
                        enabled:true
                    }
                }
            }
        }
    };

    new Chart("graph_2",{type:"line",data},options);

}

function renderVaccination(datos){
    const dates=(datos)=>{
        var date=[];
        datos.forEach(e => {
            date.push(e.date);
        });
        return date;
    }

    const vacunaciones=(datos)=>{
        var d=[];
        datos.forEach(e => {
            d.push(e.new_vaccinations);
        });
        return d;
    }

    const data={
        labels:dates(datos),
        datasets:[{
            data:vacunaciones(datos),
            pointBorderWidth:2
        }]
    };

    const options={
        plugins:{
            legend:{display:false},
            zoom:{
                zoom:{
                    wheel:{
                        enabled:true
                    }
                }
            }
        }
    };

    new Chart("graph_3",{type:"line",data},options);

}

function updateChart(idChart,data,funcion){
    const chart=Chart.getChart(idChart);
    chart.clear();
	chart.destroy();
    funcion(data);
    // chart.data.datasets[0].data=dato;
    // chart.data.datasets[0].label=labels;
    // chart.update();
}