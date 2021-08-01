import { TableData } from './Models';

export default function RadioTable({ question }: TableData) {
    return(<>{
    question.options.map((option, index) => (
        <label key = {option}>
            <input 
                type="checkbox" 
                name = {question.id}
                value = {index}/>
            <span></span>
            <p> {option} </p>
        </label>
    ))}</>)
}
