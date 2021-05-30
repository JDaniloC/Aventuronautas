import { ChallengeContext } from '../contexts/ChallengeContext';
import styles from '../styles/components/Profile.module.css';
import { useContext, useEffect, useState } from 'react';

import { FaQuestion } from 'react-icons/fa';
import { ImExit } from 'react-icons/im';

import Help from './Help';
import Cookies from 'js-cookie';

export default function Profile() {
    const { nickname, level } = useContext(ChallengeContext);
    const [ showModal, setShowModal ] = useState(false);

    function exitAccount() {
        Cookies.remove("nickname");
        location.reload();
    }
    
    return (
        <>
        <div className = {styles.profileContainer}>
            <img src="icons/profile.png" alt="Profile img"/>
            <div>
                <strong> { nickname } </strong>
                <p> 
                    <img src="icons/level.svg" alt="level img"/>    
                    Level {level}
                </p>
            </div>
            <button onClick = {() => {setShowModal(true)}}>
                <FaQuestion />
            </button>
            <button onClick = {exitAccount}>
                <ImExit />
            </button>
        </div>
        <div className = {styles.overlay} 
            onClick = {() => setShowModal(false)}
            style = {{ display: (showModal) ? "flex" : "none" }}>
            <Help />
        </div>
        </>
    );
}
