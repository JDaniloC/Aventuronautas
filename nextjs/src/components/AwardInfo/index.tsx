import styles from "../styles/pages/Home.module.css";
import { User } from "models/user";
import Podium from "./Podium";
import Infos from "./Infos";

export default function AwardInfo({ users }: { users: User[] }) {
    return (
        <section className = {styles.reward} >
            <div>
                <Infos/>
            </div>
            <div>
                <Podium users = {users}/>
            </div>
        </section>
    )
}