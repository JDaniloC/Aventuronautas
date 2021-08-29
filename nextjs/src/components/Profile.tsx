import { AuthContext } from '../contexts/AuthContext';
import styles from '../styles/components/Profile.module.css';
import { useContext, useState } from 'react';

import { FaQuestion } from 'react-icons/fa';
import { ImExit } from 'react-icons/im';

import Help from './Help';
import Cookies from 'js-cookie';

export default function Profile() {
    const { nickname, level, image } = useContext(AuthContext);
    const [ showModal, setShowModal ] = useState(false);

    function exitAccount() {
        Cookies.remove("nickname");
        location.reload();
    }
    
    function showHelp() {
        setShowModal(true)
    }

    function hideHelp() {
        setShowModal(false)
    }

    return (
        <>
        <div className = {styles.profileContainer}>
            <img src = {image} alt="Profile img"/>
            <div>
                <strong> { nickname } </strong>
                <p> 
                    <img src="icons/level.svg" alt="level img"/>    
                    Level {level}
                </p>
            </div>
            <button onClick = {showHelp}>
                <FaQuestion />
            </button>
            <button onClick = {exitAccount}>
                <ImExit />
            </button>
        </div>
        <div className = {styles.overlay} 
            onClick = {hideHelp}
            style = {{ display: (showModal) ? "flex" : "none" }}>
            <Help />
        </div>
        </>
    );
}
