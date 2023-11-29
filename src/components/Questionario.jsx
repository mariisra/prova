import React, { useState, useEffect } from 'react';
import "../css/Questionario.css"

const url = 'http://localhost:3000/Questionario';

const Questionario = () => {
  const [questoes, setQuestoes] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [questoesCorretas, setQuestoesCorretas] = useState(null);
  const [pergunta, setPergunta] = useState('');
  const [alternativas, setAlternativas] = useState(['']);
  const [respostaCorretaIndex, setRespostaCorretaIndex] = useState(0);

  useEffect(() => {
    const obterQuestoes = async () => {
      const res = await fetch(url);
      const data = await res.json();
      setQuestoes(data);
    };

    obterQuestoes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    let questoesCorretas = 0;

    for (let index = 0; index < questoes.length; index++) {
      const questao = questoes[index];

      if (questao.respostaCorreta === respostas[index]) {
        questoesCorretas++;
      }
    }

    setQuestoesCorretas(questoesCorretas);
    setRespostas(Array(questoes.length).fill(''));
  };

  const handleAdicionarQuestao = async (e) => {
    e.preventDefault();

    const questaoParaAdicionar = {
      pergunta: pergunta,
      alternativas: alternativas,
      respostaCorreta: alternativas[respostaCorretaIndex]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questaoParaAdicionar),
    });

    const addedQuestao = await response.json();

    setQuestoes((prevQuestoes) => [...prevQuestoes, addedQuestao]);

    setPergunta('');
    setAlternativas(['']);
    setRespostas(['']);
    setRespostaCorretaIndex(0);
  };

  const handleAddAlternativa = () => {
    setAlternativas([...alternativas, '']);
  };

  const handleAlterarAlternativa = (index, value) => {
    const novasAlternativas = [...alternativas];
    novasAlternativas[index] = value;
    setAlternativas(novasAlternativas);
  };

  const handleRemoverAlternativa = (index) => {
    const novasAlternativas = [...alternativas];
    novasAlternativas.splice(index, 1);
    setAlternativas(novasAlternativas);
  };

  const handleExcluirQuestao = async (id) => {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setQuestoes((prevQuestoes) => prevQuestoes.filter((questao) => questao.id !== id));
        alert('Questão excluída com sucesso!');
      } else {
        alert('Erro ao excluir a questão.');
      }
    } catch (error) {
      console.error('Erro ao excluir a questão:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Adicionar Questão</h2>
      <form onSubmit={handleAdicionarQuestao} className="form">
        <label>
          Digite a pergunta:
          <input type="text" name="pergunta" value={pergunta} onChange={(e) => setPergunta(e.target.value)} className="input" />
        </label>
        <br />
        <label className="label">
          Digite as alternativas:
          {alternativas.map((alternativa, index) => (
            <div key={index}>
              <input
                type="text"
                name={`alternativa${index}`}
                value={alternativa}
                className="input"
                onChange={(e) => handleAlterarAlternativa(index, e.target.value)}
              />
              <button type="button" onClick={() => handleRemoverAlternativa(index)} className="removeButton">
                Remover Alternativa
              </button>
            </div>
          ))}
          <br />
          <button type="button" onClick={handleAddAlternativa} className="addButton">
            Adicionar Alternativa
          </button>
        </label>
        <br />
        <label className="label">
          Selecione a resposta correta:
          <select
            value={respostaCorretaIndex}
            onChange={(e) => setRespostaCorretaIndex(parseInt(e.target.value))}
            className="select"
          >
            {alternativas.map((alternativa, index) => (
              <option key={index} value={index}>
                {alternativa}
              </option>
            ))}
          </select>
        </label>
        <br />
        <input type="submit" value="Adicionar Questão" className="submitButton"/>
      </form>

      <br />

      <h2 className="heading">Responder Questões</h2>
      <form onSubmit={handleSubmit}>
        {questoes &&
          questoes.map((questao, index) => (
            <div key={index} className="questionContainer">
              <p className="questionText">{questao.pergunta}</p>
              {questao.alternativas &&
                questao.alternativas.map((alternativa, altIndex) => (
                  <label key={altIndex} className="optionLabel">
                    <input
                      type="radio"
                      name={`questao${index}`}
                      value={alternativa}
                      checked={respostas[index] === alternativa}
                      onChange={(e) => {
                        const newRespostas = [...respostas];
                        newRespostas[index] = e.target.value;
                        setRespostas(newRespostas);
                      }}
                    />
                    {alternativa}
                  </label>
                ))}
              <button type="button" className="removeButton" onClick={() => handleExcluirQuestao(questao.id)}>
                Excluir X
              </button>
            </div>
          ))}
        <br />
        <input type="submit" value="Verificar Respostas" />
        <br />
      </form>

      {questoesCorretas !== null && (
        <div>
          <p>{questoesCorretas} Questoes Corretas</p>
          {questoesCorretas > questoes.length / 2 && (
            <img src="src\assets\fogos.gif" alt="Parabens" />
          )}
          {questoesCorretas < questoes.length / 2 && (
            <img src="src\assets\monkey-23.gif" alt="Continue tentando" />
          )}
        </div>
      )}
    </div>
  );
};

export default Questionario;
