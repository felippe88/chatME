import React, { useEffect, useState } from "react";
import socketIOclient from 'socket.io-client';
import { RadioButton } from 'react-native-paper';
import { Button, StyleSheet, Text, TextInput, View, ScrollView, SafeAreaView } from "react-native";
import {
    ContainerAcesso, TituloAcesso, TituloCampo, CampoFormulario, ConteudoCampoRadio,
    TituloOpcaoRadio, BotaoBasico, TextoBotaoBasico, ContainerChat, FormMensagem, CampoMensagem,
    BotaoEnviarMsg, TextoBotaEnviarMsg, ListarMensagem, MsgEnviada, DetMsgEnviada, MsgRecebida, DetMsgRecebida
} from './styles/styles'

import api from './config/configApi';

let socket;

function Chat() {

    const ENDPOINT = "http://10.0.0.247:8080";

    const [logado, setLogado] = useState(false);
    const [usuarioID, setusuarioID] = useState("");
    const [nome, setNome] = useState("");
    const [sala, setSala] = useState("");
    const [email, setEmail] = useState("");
    const [salas, setSalas] = useState([]);
    /*
    const [logado, setLogado] = useState(true);
    const [usuarioID, setusuarioID] = useState("1");
    const [nome, setNome] = useState("Felipe");
    const [email, setEmail] = useState("test@hotmail.com");
    const [sala, setSala] = useState("1");*/


    const [mensagem, setMensagem] = useState("");
    const [listaMensagem, setListaMensagem] = useState([]);

    const [status, setStatus] = useState({

        type: "",
        mensagem: ""

    });

    useEffect(() => {
        socket = socketIOclient(ENDPOINT);
        listarSalar();
    }, []);


    useEffect(() => {
        socket.on("receber_mensagem", (dados) => {
            setListaMensagem([dados, ...listaMensagem]);
        });
    });

    const conectarSala = async e => {
        e.preventDefault();

        const headers = {
            'Content-Type': 'application/json'
        }

        await api.post("validar-acesso", { email }, headers)
            .then((response) => {
                //console.log("acessou a sala "+ sala +" com o e-mail " + email);
                setusuarioID(response.data.usuario.id);
                setNome(response.data.usuario.nome);
                setLogado(true);
                socket.emit("sala_conectar", Number(sala));
                listarMensagens();

            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: "erro",
                        mensagem: err.response.data.mensagem
                    });
                } else {
                    setStatus({
                        type: "erro",
                        mensagem: "Erro: Tente mais tarde!"
                    });

                }
            });

    }

    const enviarMensagem = async () => {
        const conteudoMensagem = {
            sala: Number(sala),
            conteudo: {
                mensagem,
                usuario: {
                    id: usuarioID,
                    nome
                }
            }
        }
        //console.log(conteudoMensagem);
        await socket.emit("enviar_mensagem", conteudoMensagem);
        setListaMensagem([conteudoMensagem.conteudo,...listaMensagem]);
        setMensagem("");
    }

    const listarMensagens = async () => {
        await api.get('/listar-mensagens-mob/' + sala)
            .then((response) => {
                setListaMensagem(response.data.mensagens)
            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: "erro",
                        mensagem: err.response.data.mensagem
                    });
                } else {
                    setStatus({
                        type: "erro",
                        mensagem: "Erro: Tente mais tarde!"
                    });

                }

            });
    }


    const listarSalar = async () => {
        await api.get('/listar-sala')
            .then((response) => {
                setSalas(response.data.salas);
            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: "erro",
                        mensagem: err.response.data.mensagem
                    });
                } else {
                    setStatus({
                        type: "erro",
                        mensagem: "Erro: Tente mais tarde!"
                    });

                }
            });
    }

    return (
        <>


            {!logado ?
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
                    <ContainerAcesso>
                        <TituloAcesso>ChatME</TituloAcesso>
                        {status.type === 'erro' ? <Text>{status.mensagem}</Text> : <Text>{""}</Text>}
                        <TituloCampo>E-mail</TituloCampo>
                        <CampoFormulario
                            style={styles.input}
                            autoCorrect={false}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="Coloque seu E-mail"
                            value={email}
                            onChangeText={(texto) => { setEmail(texto) }}
                        />
                        <TituloCampo>Sala</TituloCampo>
                        {/*<TextInput
                        style={styles.input}
                        placeholder="Sala"
                        value={sala}
                        onChangeText={(texto) => {setSala(texto)}}
                        />*/}
                        {salas.map((detSala) => {
                            return (
                                <ConteudoCampoRadio key={detSala.id}>
                                    <RadioButton
                                        value={detSala.id}
                                        status={sala === detSala.id ? 'checked' : 'unchecked'}
                                        onPress={() => setSala(detSala.id)}
                                    />
                                    <TituloOpcaoRadio>{detSala.nome}</TituloOpcaoRadio>
                                </ConteudoCampoRadio>
                            )
                        })}


                        <BotaoBasico onPress={conectarSala}>
                            <TextoBotaoBasico>Acessar</TextoBotaoBasico>
                        </BotaoBasico>
                    </ContainerAcesso>
                </ScrollView>
                :
                <ContainerChat>

                    <ListarMensagem
                        inverted={true}

                        data={listaMensagem}

                        renderItem={({ item }) => (
                            <>
                                {item.usuario.id === usuarioID ?
                                    <MsgEnviada>
                                        <DetMsgEnviada>

                                            {item.usuario.nome}: {item.mensagem}

                                        </DetMsgEnviada>
                                    </MsgEnviada>
                                    :
                                    <MsgRecebida>

                                        <DetMsgRecebida>
                                            {item.usuario.nome}: {item.mensagem}
                                        </DetMsgRecebida>

                                    </MsgRecebida>

                                }

                            </>
                        )}
                        keyExtractor={(item, index) => index.toString()}


                    />
                    <FormMensagem>


                        <CampoMensagem
                            style={styles.input}
                            placeholder="Mensagem..."
                            value={mensagem}
                            onChangeText={(texto) => { setMensagem(texto) }}
                        />

                        <BotaoEnviarMsg onPress={enviarMensagem}>
                            <TextoBotaEnviarMsg>Enviar</TextoBotaEnviarMsg>

                        </BotaoEnviarMsg>

                    </FormMensagem>
                </ContainerChat>

            }


        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 40,
        flex: 1,
        backgroundColor: '#fff'
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
    }
})

export default Chat;