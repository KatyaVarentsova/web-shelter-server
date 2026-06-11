import { Request } from "express";

export type PetCategory = 'Кошка' | 'Собака';

export type PetGender = 'Мальчик' | 'Девочка';

export type PetWool = 'Короткая' | 'Длинная';

export type PetCharacter = 'Спокойный' | 'Активный';

export interface ICurator {
    id: string;
    last_name: string;
    first_name: string;
    middle_name: string;
    description: string;
    image: string;
    birthday: string;
    phone_number: string;
}

export interface IMessenger {
    id: string;
    curator_id: string;
    messenger: string;
    nickname: string;
}

export interface IPet {
    id: string;
    nickname: string;
    category: PetCategory;
    size: number;
    character: PetCharacter;
    birthday: string;
    gender: PetGender;
    wool: PetWool;
    for_family: boolean;
    for_dogs: boolean;
    for_cats: boolean;
    is_guest: boolean;
    description: string;
    curator_id: string;
}

export interface IPetImage {
    id: string;
    pet_id: string;
    image: string;
    number: number;
}

export interface IPetHistory {
    id: string;
    pet_id: string;
    event: string;
    description: string;
}

export interface IRequest {
    id: string;
    name: string;
    contact: string;
    by_phone: boolean;
    on_messenger: boolean;
    pet_id: string;
    comment: string;
}

export interface IUser {
    id: string;
    login: string;
    password: string;
}

export interface AuthRequest extends Request {
    tokenData?: {
        id: string;
        role: string;
    };
}