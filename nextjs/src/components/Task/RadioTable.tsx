import { TableData } from './Models';

export default function RadioTable({ question }: TableData) {
    return(<>{
    question.options.map(option => (
        <label key = {option}>
            <input 
                type="radio" 
                name = {question.id}
                value = {option}/>
            <span/>
            <p> {option} </p>
        </label>
    ))}</>)
}
