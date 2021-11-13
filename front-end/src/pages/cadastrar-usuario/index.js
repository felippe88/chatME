import React, { useState } from "react";
import { Redirect } from "react-router";
import api from "../../config/configApi";

import {
    Container, Conteudo, Header, Form, Campo, Label, Input, Select,
    BtnAcessar, AlertErro
  } from "../../styles/styles";
export const CadastrarUsuario = () => {

    const [usuario, setUsuario] = useState({
        nome: '',
        email: ''
    });


    const [status, setStatus] = useState({
        type: '',
        mensagem: ''
    });

    const valueInput = e => setUsuario({ ...usuario, [e.target.name]: e.target.value });

    const addUsuario = async e => {
        e.preventDefault();

        const headers = {
            'headers': {
                'Content-Type': 'application/json'

            }
        }

        await api.post("/cadastrar-usuario", usuario, headers)
            .then((response) => {
                setStatus({
                    type: 'redSuccess',
                    mensagem: response.data.mensagem
                });
            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: 'error',
                        mensagem: err.response.data.mensagem
                    });
                } else {
                    setStatus({
                        type: 'error',
                        mensagem: "Erro: Tente mais tarde!"
                    });
                }
            });


    }



    return (
        <Container>
            <Conteudo>
                <Header>ChatME - Cadastro</Header>
                <Form onSubmit={addUsuario}>
                    {status.type === 'error' ? <AlertErro style={{ color: "#f00" }}>{status.mensagem}</AlertErro> : ''}
                    {status.type === 'redSuccess' ? <Redirect to="/" />:''}
                    <Campo>
                        <Label>Nome: </Label>
                        <Input type="text" placeholder="nome" name="nome" onChange={valueInput}/>
                    </Campo>

                    <Campo>
                        <Label>E-mail: </Label>
                        <Input type="email" placeholder="E-mail" name="email" onChange={valueInput} />
                    </Campo>

                    <BtnAcessar type="submit">Cadastrar</BtnAcessar>

                </Form>

            </Conteudo>

        </Container>


    )


}