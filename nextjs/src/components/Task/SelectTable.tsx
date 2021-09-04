import styles from '../../styles/components/Task.module.css';
import { useEffect, useState } from 'react';
import { TableData } from "./Models";

export default function SelectTable({ question }: TableData) {
    const [rowList, setRowList] = useState([]);
    const [columnList, setColumnList] = useState([]);

    useEffect(() => {
        setRowList(question.options[0] as string[]);
        setColumnList(question.options[1] as string[]);
    }, [])

    return (<table className = {styles.selectTable}>
        <thead>
            <tr>
                <th/>
                {columnList.map(column => (
                    <th key = {column}> {column} </th>
                ))} 
            </tr>
        </thead>
        <tbody>
            {rowList.map((row, rowIndex) => (
                <tr key = {row}>
                <th> {row} </th>
                {columnList.map((column, index) => (
                    <th key = {column}>
                    <label>
                        <input 
                            name = {String(rowIndex)}
                            type="radio" value = {index}/> 
                        <span/>
                    </label>
                    </th>
                ))}
                </tr>
            ))}
        </tbody>
    </table>)
}
