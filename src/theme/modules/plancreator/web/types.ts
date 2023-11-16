export type Employee = {
    id: number,
    name: string,
    surname: string,
    group: number,
    disabled: boolean
}

export type Group = {
    id: number,
    name: string,
    algorithm: boolean
}

export type WorkHour = {
    id: number,
    name: string,
    hours: string
}

export type Zmiana = {
    id: number,
    Nazwa: string,
    Godz_pracy: string
}

export type Day = {
    id: number,
    Czy_pracuje: boolean,
    Pracownik_id: number,
    Zmiana_id: number,
    Grafik_id: number,
    Dzien: number,
    Miesiac: number,
    Rok: number,
    Zmiana: Zmiana
}

export type localDate = {
    month: number,
    year: number
}