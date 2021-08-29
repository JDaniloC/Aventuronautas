import styles from "../styles/pages/Home.module.css";
import { User } from "models/user";

export default function Podium({ users }: { users: User[] }) {
    function getScore(user: User) {
        const result = user.currentExperience +
            user.challengesCompleted * 200 +
            (user.level - 1) * 300 -
            (user.idade - 6) * 100;

        return (result > 0) ? result : 0;
    }

    return (<div className = {styles.rankingContainer}>
        <h1> Ranking </h1>
        <div className = {styles.ranking}>
            <span> Codinome </span>
            <span> Missões </span>
            <span> Pontuação </span>
        </div>
        {users.sort((a: User, b: User) => { 
            return getScore(b) - getScore(a);
        }).map((user: User) => 
            <div key = {user.nickname}
                className = {styles.ranking}>
                <span>
                    {user.nickname}
                </span>
                <span>
                    {user.challengesCompleted}
                </span>
                <span>
                    {getScore(user)}
                </span>
            </div>
        )}
    </div>)
}