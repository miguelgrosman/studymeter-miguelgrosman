import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjects, setSubjects] = useState(() => {
    const stored = localStorage.getItem("subjects");
    return stored ? JSON.parse(stored) : [
      { name: "Português", time: 0 },
      { name: "Matemática", time: 0 },
      { name: "Inglês", time: 0 },
      { name: "Física", time: 0 },
      { name: "Redação", time: 0 },
    ];
  });

  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [dailyTime, setDailyTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = setInterval(() => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedDay = localStorage.getItem("day");
    if (savedDay !== today) {
      localStorage.clear();
      localStorage.setItem("day", today);
      setSubjects([
        { name: "Português", time: 0 },
        { name: "Matemática", time: 0 },
        { name: "Inglês", time: 0 },
        { name: "Física", time: 0 },
        { name: "Redação", time: 0 },
      ]);
      setDailyTime(0);
    }
  }, []);

  const startTimer = () => {
    if (!selectedSubject) {
      alert("Selecione uma matéria antes de iniciar!");
      return;
    }
    if (isRunning) return;
    setIsRunning(true);
    const id = setInterval(() => setTime((prev) => prev + 1), 1000);
    setIntervalId(id);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(intervalId);
  };

  const finishTimer = () => {
    if (!selectedSubject) {
      alert("Selecione uma matéria antes de finalizar!");
      return;
    }
    clearInterval(intervalId);
    setIsRunning(false);
    setSubjects((prev) =>
      prev.map((s) =>
        s.name === selectedSubject ? { ...s, time: s.time + time } : s
      )
    );
    setDailyTime((prev) => prev + time);
    setTime(0);
  };

  const addSubject = () => {
    const name = prompt("Digite o nome da nova matéria:");
    if (!name) return;
    if (subjects.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      alert("Essa matéria já existe!");
      return;
    }
    setSubjects([...subjects, { name, time: 0 }]);
  };

  const deleteSubject = (name) => {
    if (window.confirm(`Deseja excluir "${name}"?`)) {
      setSubjects(subjects.filter((s) => s.name !== name));
    }
  };

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const maxTime = Math.max(...subjects.map((s) => s.time), 1);

  return (
    <div className="app">
      <header>
        <span className="credits">Criado por: @miguelgrosman</span>
        <span className="clock">{clock}</span>
      </header>

      <h1 className="main-timer">{formatTime(time)}</h1>
      <h2 className="daily-timer">Tempo total de estudo: {formatTime(dailyTime)}</h2>

      <p className="instruction">
        Para contabilizar a matéria, clique em finalizar.
      </p>

      <div className="controls">
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="subject-select"
        >
          <option value="">Selecione a matéria</option>
          {subjects.map((s) => (
            <option key={s.name}>{s.name}</option>
          ))}
        </select>

        <button className="btn start" onClick={startTimer}>Iniciar</button>
        <button className="btn pause" onClick={pauseTimer}>Pausar</button>
        <button className="btn finish" onClick={finishTimer}>Finalizar</button>
      </div>

      <div className="subjects">
        {subjects.map((s) => (
          <div className="subject-card" key={s.name}>
            <button className="delete-btn" onClick={() => deleteSubject(s.name)}>
              ×
            </button>
            <h3>{s.name}</h3>
            <p>{formatTime(s.time)}</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(s.time / maxTime) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}

        <div className="subject-card add-card" onClick={addSubject}>
          <h3>+ Nova Matéria</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
