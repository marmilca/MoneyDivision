import { Person } from './Person';

export interface Order {
    id: number;
    total: number;
    avarage: number;
    personList: Person[];
}