export type AnimalType = 'Кошка' | 'Собака';

export type CharacterType = 'Спокойный' | 'Активный';

export type GenderType = 'Мальчик' | 'Девочка';

export type FurType = 'Короткая' | 'Длинная';

export type PetStatus =
  | 'В приюте'
  | 'На передержке'
  | 'В добрых руках'
  | 'Умерло';

export type Other = 
  | 'Для семьи с детьми'        
  | 'Ладит с собаками'       
  | 'Ладит с кошками'        
  | 'На передержке'; 

export type Health = 'Здоровая' | 'Подготовка к операции' | 'На лечение'

export interface IPet {
  id: number;
  type: AnimalType;           // кошка / собака
  weight: number;             // вес в кг
  character: CharacterType;   // спокойный / активный
  age: number;                // возраст (в годах)
  gender: GenderType;         // пол
  fur: FurType;               // тип шерсти
  description: string;        // описание
  images: string[];           // массив картинок
  status: PetStatus;          // статус животного
  other: Other[];             // другие характеристики 
  health: Health;             // здоровье 
  comment?: string;           // комментарий
}