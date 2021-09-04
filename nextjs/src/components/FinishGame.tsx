import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import styles from '../styles/components/FinishGame.module.css';

export default function FinishGame() {
    const { challengesCompleted } = useContext(AuthContext);
    
    return (
        <div className = {styles.finishContainer}>
            <h2> Completar todas as missões! </h2>
            <p> Se você completou as 14 missões, clique neste botão. </p>
            <p> Fale com seu conselheiro, para provar o seu valor, </p> 
            <p> e dessa forma, concorrer a brindes, Boa sorte! </p>
            <button className = "project" type = "button"
                disabled = {challengesCompleted !== 14}>
                Salvar o mundo
            </button>
        </div>
    );
}
