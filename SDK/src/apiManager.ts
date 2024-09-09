import { getPlayer } from '@dcl/sdk/src/players'
import { showPlayerNotification } from './ui';

export class APIManager {
    baseURL: string = '';
    playerAddress?: string = '';
    constructor(baseURL: string = 'http://localhost:3000'){
        this.baseURL = baseURL;
        const player = getPlayer();
        this.playerAddress = player?.userId;
    }

    public setPlayer(): void {
        const player = getPlayer();
        this.playerAddress = player?.userId;
    }

    public async sendGet(endpoint: string, params: object): Promise<any>{


      

        const query: any = {...params, address: this.playerAddress}
        

        const url = this.baseURL + [endpoint] + '?' + Object.keys(query).map(key => key + '=' + query[key]).join('&');
        const res = await fetch(url, {
            method: "GET",
            headers: {
                'mode':'no-cors',
            } });
        const result = await res.json();

        if (res.ok) {
           
            return result
        } 
        else {
            //show error message
            console.log("Error ", result.message)
            showPlayerNotification(result.message)

            return null
        }
            
    }

    public async sendPost(endpoint: string, request: object): Promise<any>{
     
        
        const body = {...request, address: this.playerAddress};
        const res = await fetch(this.baseURL + [endpoint], {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body)
        })
        const result = await res.json();

        if (res.ok) {
         
            return result
        } else{
            //show error message
            console.log("Error ", result.message)
            showPlayerNotification(result.message)
            return null
        }
       
    }

    public async getUser(): Promise<any> {
        const response = await this.sendGet('/api/getUser',{});
        return response;
    }

    public async plantSeed(plotNumber: number): Promise<any> {
        const response = await this.sendPost('/api/plantSeed',{plotNumber});
        return response;
    }

    public async pickPlant(plantNumber: number): Promise<any> {
        const response = await this.sendPost('/api/pickPlant',{plantNumber});
        return response;
    }

    public async crushPlant(): Promise<any> {
        const response = await this.sendPost('/api/crushPlant',{});
        return response;
    }

    public async mixPotion(): Promise<any> {
        const response = await this.sendPost('/api/mixPotion',{});
        return response;
    }
}

export const apiManager = new APIManager(); // Add your api url here
