import React, { Component } from "react";
import './Main.css';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = { current: "main" }
        this.updatePage = this.updatePage.bind(this);
    }

    componentDidUpdate() {
        //        this.updatePage(); 
    }

    updatePage() {
        this.props.callbackCurrentPage("main");
    }

    render() {
        return (
            <>
                            <ol>
                                <li> [ ] Implementar vários tipos de autenticação: OAUth, Basic auth, token auth, jwt e openid<br></br></li>
                                <li> [ ] Preparar uma API gRPC</li>
                                <li> [ ] Colocar o servidor e a base de dados em containers docker separados</li>
                                <li> [ ] Ansible - Automatizar e configurar docker containers através do Ansible</li>
                                <li> [ ] Criar um forward proxy para pedir conteúdo ao servidor, servindo de intermediário (e ocultando a identidade do cliente). Usar o kubernetes.</li>
                                <li> [ ] Criar um reverse proxy para enviar o conteúdo pedido em substituição do servidor, que funciona também como um caching server e load balancer<br></br></li>
                                <li> [ ] Redis - Configurar Redis para fazer cahce.</li>
                                <li> [ ] Configurar a firewall do servidor para fechar determinados tipos de acesso</li>
                                <li> [ ] Ler e configurar o jenkins. Testar uma pipeline.<br></br></li>
                                <li> [ ] Terraform?<br></br> </li>
                                <li> [ ] Instalar o nagios no gns3<br></br></li>

                            </ol>

            </>
        );
    }
}


export default Main;