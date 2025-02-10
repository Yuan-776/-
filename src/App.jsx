import { useState, useEffect, useCallback } from 'react';
import './App.css';

const SYMBOLS = ['🎭', '🎨', '🎪', '🎢', '🎡', '🎮', '🎲', '🎯', 
                '🎱', '🎳', '🎸', '🎺', '🎻', '🎹', '🎷', '🎼'];

const Card = ({ value, isFlipped, isMatched, onClick }) => (
  <div 
    onClick={onClick}
    className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
  >
    <div className="card-front">?</div>
    <div className="card-back">{value}</div>
  </div>
);

function App() {
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [flippedCards, setFlippedCards] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const initializeCards = useCallback(() => {
    const cardPairs = [...SYMBOLS, ...SYMBOLS];
    setCards(
      cardPairs
        .sort(() => Math.random() - 0.5)
        .map(value => ({
          value,
          isFlipped: false,
          isMatched: false
        }))
    );
  }, []);

  const remainingPairs = cards.filter(card => !card.isMatched).length / 2;

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const flipCard = (index) => {
    if (flippedCards.length === 2) return;
    if (cards[index].isMatched) return;
    if (cards[index].isFlipped) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    setFlippedCards([...flippedCards, index]);

    if (flippedCards.length === 1) {
      const [firstIndex] = flippedCards;
      if (cards[firstIndex].value === cards[index].value) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[index].isMatched = true;
          setCards(matchedCards);
          setScore(s => s + 100);
          setFlippedCards([]);
          
          // Check if game is over
          if (matchedCards.every(card => card.isMatched)) {
            setIsGameOver(true);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[index].isFlipped = false;
          setCards(resetCards);
          setScore(s => Math.max(0, s - 10));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const restartGame = () => {
    setScore(0);
    setGameTime(0);
    setFlippedCards([]);
    setIsGameOver(false);
    initializeCards();
  };

  useEffect(() => {
    initializeCards();
  }, [initializeCards]);

  useEffect(() => {
    if (!isGameOver) {
      const timer = setInterval(() => {
        setGameTime(t => t + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isGameOver]);

  return (
    <div className="game-container">
      <h1 className="game-title">四川翻牌机</h1>
      
      <div className="game-stats">
        <div>分数: {score}</div>
        <div>剩余配对: {remainingPairs}</div>
        <div>时间: {formatTime(gameTime)}</div>
      </div>

      <div className="game-board">
        {cards.map((card, index) => (
          <Card
            key={index}
            value={card.value}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={() => flipCard(index)}
          />
        ))}
      </div>

      <button className="restart-button" onClick={restartGame}>
        重新开始
      </button>

      {isGameOver && (
        <div className="game-over-modal">
          <div className="modal-content">
            <h2>游戏结束！</h2>
            <p>最终得分: {score}</p>
            <p>用时: {formatTime(gameTime)}</p>
            <button onClick={restartGame}>
              再来一局
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;