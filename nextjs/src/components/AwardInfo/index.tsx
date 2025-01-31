import { User } from "models/user";
import Podium from "./Podium";
import Infos from "./Infos";

import React from "react";
import styles from "styles/pages/Home.module.css";

export default function AwardInfo({ users }: { users: User[] }) {
  return (
    <section className={styles.reward}>
      <div>
        <Infos />
      </div>
      <div>
        <Podium users={users} />
      </div>
    </section>
  );
}
