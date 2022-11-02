import CovidService from "./CovidService.js";
const covid=new CovidService();
var btnOn=[];
const btn1=document.getElementById("btn-group-1");
const btn2=document.getElementById("btn-group-2");
const btn3=document.getElementById("btn-group-3");
var chart1;
var chart2;
var chart3;

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
    const data={
        labels:datos.map(item=>new Intl.DateTimeFormat("es-MX",{year:"numeric",month:"long",day:"numeric"}).format(new Date(item.date))),
        datasets:[{
            label:"Muertes",
            data:datos.map(item=>item.total_deaths),
            pointBorderWidth:2
        }]
    };

    const options={
        scales:{
            x:{
                grid:{
                    display:false
                }
            },
            y:{
                grid:{
                    display:false
                }
            }
        },
        plugins:{
            legend: { 
                position:"bottom",
                labels:{
                    fontColor:"black",
                    fontFamily:"system-ui",
                    boxWidth: 15,
                },
            },
            elements:{
                point:{
                    redius:6,
                }
            },           
            tooltip:{
                callbacks:{
                    title:(context)=>{return context[0].label},
                    afterTitle:()=>{return "====================="},
                    afterBody:(context)=>{
                        return "N. muertes del dia: "+datos[context[0].dataIndex].new_deaths;
                    }
                },
            },
            zoom:{
                zoom:{
                    mode:"x",
                    overScaleMode:"y",
                    wheel:{
                        enabled:true,
                        modifierKey:'ctrl',
                    }
                }
            }
        }
    };

    chart1=new Chart("graph_1",{type:"line",data,options});
    document.getElementById("reset1").addEventListener("click",()=>{resetZoomChart(chart1)});

}

function renderCases(datos){
    const data={
        labels:datos.map(item=>new Intl.DateTimeFormat("es-MX",{year:"numeric",month:"long",day:"numeric"}).format(new Date(item.date))),
        datasets:[{
            label:"Casos Covid",
            data:datos.map(item=>item.total_cases),
            pointBorderWidth:2
        }]
    };

    const options={
        scales:{
            x:{
                grid:{
                    display:false
                }
            },
            y:{
                grid:{
                    display:false
                }
            }
        },
        plugins:{
            legend: { 
                position:"bottom",
                labels:{
                    fontColor:"black",
                    fontFamily:"system-ui",
                    boxWidth: 15,
                },
            },
            elements:{
                point:{
                    redius:6,
                }
            },           
            tooltip:{
                callbacks:{
                    title:(context)=>{return context[0].label},
                    afterTitle:()=>{return "====================="},
                    afterBody:(context)=>{
                        return "Casos diarios: "+datos[context[0].dataIndex].new_cases;
                    }
                },
            },
            zoom:{
                zoom:{
                    mode:"x",
                    overScaleMode:"y",
                    wheel:{
                        enabled:true,
                        modifierKey:'ctrl',
                    }
                }
            }
        }
    };

    chart2=new Chart("graph_2",{type:"line",data,options});
    document.getElementById("reset2").addEventListener("click",()=>{resetZoomChart(chart2)});

}

function renderVaccination(datos){
    const data={
        labels:datos.map(item=>new Intl.DateTimeFormat("es-MX",{year:"numeric",month:"long",day:"numeric"}).format(new Date(item.date))),
        datasets:[{
            label:"Vacunciones",
            data:datos.map(item=>item.total_vaccinations),
            pointBorderWidth:2
        }]
    };

    const options={
        scales:{
            x:{
                grid:{
                    display:false
                }
            },
            y:{
                grid:{
                    display:false
                }
            }
        },
        plugins:{
            legend: { 
                position:"bottom",
                labels:{
                    fontColor:"black",
                    fontFamily:"system-ui",
                    boxWidth: 15,
                },
            },
            elements:{
                point:{
                    redius:6,
                }
            },           
            tooltip:{
                callbacks:{
                    title:(context)=>{return context[0].label},
                    afterTitle:()=>{return "====================="},
                    afterBody:(context)=>{
                        return "vacunados este dia: "+datos[context[0].dataIndex].new_vaccinations;
                    }
                },
            },
            zoom:{
                zoom:{
                    mode:"x",
                    overScaleMode:"y",
                    wheel:{
                        enabled:true,
                        modifierKey:'ctrl',
                    }
                }
            }
        }
    };

    chart3=new Chart("graph_3",{type:"line",data,options});
    document.getElementById("reset3").addEventListener("click",()=>{resetZoomChart(chart3)});

}


function resetZoomChart(chart){
    chart.resetZoom();
}

function updateChart(idChart,data,funcion){
    const chart=Chart.getChart(idChart);
    chart.clear();
	chart.destroy();
    funcion(data);
}