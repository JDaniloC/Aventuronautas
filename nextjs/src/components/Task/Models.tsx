export interface Question {
    id: string;
    type: string;
    title: string;
    mission: number;
    difficulty: number;
    options: string[] | string[][];
}
export interface Answer {
    id: string;
    title: string;
    option: string | number[];
}

export interface RevisionData {
    questions: Question[];
    hits: number[];
}

export interface TableData {
    question: Question;
}

export interface TaskData {
    style?: object;
    username: string, 
    quests: Question[], 
    finishFunc: (value: number) => void 
}
