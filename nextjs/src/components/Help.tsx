import styles from '../styles/components/Help.module.css';
import { ImExit } from 'react-icons/im';

export default function Help() {
    return (
        <div className = {styles.container}>
            <h1> Como funciona? </h1>
            <section className = {styles.helpTheme}>
                <span> 1° </span>
                <div>
                    <button className = {styles.profileBtn}> 
                        <ImExit /> 
                    </button>
                    <p> 
                        Ao entrar no site, <b>coloque o seu nome ou apelido</b>, para ser 
                        identificado! Se você colocou errado, clique no botão indicado 
                        na direita, para sair da conta e entrar em outra. Além disso,  
                        <b>você deve se identificar a cada missão</b>, no primeiro 
                        campo de cada formulário!
                    </p>
                </div>
            </section>
            
            <section className = {styles.helpTheme}>
                <div className = {styles.missionBtn}>
                    <button className="project" disabled> Bloqueado </button>
                    <button className="project"> Desbloqueado </button>
                    <p>
                        Cada missão feita, <b>desbloqueia</b> a próxima missão, no qual os 
                        botões vermelhos significam <b>as missões bloqueadas</b>, enquanto 
                        os brancos estão disponíveis. Seu objetivo é terminar todas as 14 
                        missões o antes possível, acumulando a maior quantidade de níveis 
                        (lendo/assistindo durante as missões).
                    </p>
                </div>
                <span> 2° </span>
            </section>
            
            <section className = {styles.helpTheme}>
                <span> 3° </span>
                <div>
                    <p>
                        Cada missão é dividida em <b>3 etapas</b>, onde a primeira 
                        consiste em ler e responder <b>sua revista</b>, a segunda
                        em assistir a explicação da lição (se ainda tiver dúvidas)
                        e por fim, <b>provar</b> que entendeu respondendo mais uma vez.
                        Lembrando que tudo isso é uma preparação para <b>o teste
                        final</b>, <b>peça ajuda</b> dos seus pais.
                    </p>
                </div>
            </section>

            <section className = {styles.helpTheme}>
                <div className = {styles.missionBtn}>
                    <button className="project">
                        Salvar o mundo
                    </button>
                    <p>
                       Por fim, <b>revise todo o conteúdo</b>, e clique no botão  
                       <b> salvar o mundo</b> na página principal, escolha seu prêmio 
                       (só para os 3 primeiros finalistas) e peça o teste final. Boa sorte!
                    </p>
                </div>
                <span> 4° </span>
            </section>
        </div>
    );
}
