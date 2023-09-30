import type { Attributes } from "./attributes";
import type { Collection } from "./collection";

export interface Nft{
    id: string;
    part_id:string;
    name: string;
    description: string;
    image: string;
    symbol: string;
    deactivated: boolean;
    attributes:Attributes;
    collection: Collection;
    ingredients?: Nft[];
    x?:number;
    y?:number;
    quantity?:number; // quantity for crafting
}