import React, { useEffect, useState } from 'react';
import { ScoresList, ScoreLI } from '../styled/HighScores';

export default function HighScores() {
  // display those scores
  const [highScores, setHighScores] = useState([]);

  // use the fetch API to call getHighScores function
  useEffect(() => {
    const loadHighScores = async () => {
      try {
        const res = await fetch('/.netlify/functions/getHighScores');
        const scores = await res.json();
        setHighScores(scores.formattedRecords);
      } catch (err) {
        console.error(err);
      }
    };
    loadHighScores();
  }, []);

  return (
    <div>
      <h1>HighScores</h1>
      <ScoresList>
        {highScores.map((score) => (
          <ScoreLI key={score.id}>
            {score.field.name} - {score.field.score}
          </ScoreLI>
        ))}
      </ScoresList>
    </div>
  );
}
