import { IPerson } from './IPerson';

export interface IOrder {
    id: number;
    total: number;
    average: number;
    personList: IPerson[];
}