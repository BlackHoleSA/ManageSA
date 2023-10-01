import type { Nft } from "../nft";

export  interface Galaxy{
    stations: StationSpace[]
}


export interface StationSpace{
    x: number;
    y: number;
    mint: string;
    owner: string;
    ships: Ship[];

    inventory: ResourceState[];
}

export  interface Ship{
    items: Nft[];// solo consumables o materiales
    fuel: ResourceState;
}

export interface ResourceState{
    mint: string;
    owner: string;
    token: string;
    nft: Nft;
    tokenAmmount: TokenAmmount 
}

export interface TokenAmmount{
    amount: string;
    decimals: number;
    uiAmount: number;
    uiAmountString: string;
}