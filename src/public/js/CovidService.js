class CovidService{

    constructor(){
        this.URI="/api/covid";
    }

    async getCountries(){
        const response=await fetch(this.URI+"/countries");
        const countries=await response.json();
        return countries;
    }

    async getData(id){
        const response=await fetch(this.URI+"/data/"+id);
        const data=await response.json();
        return data;
    } 
}

export default CovidService;