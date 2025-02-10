import { useState, useEffect, useCallback } from 'react';

const SYMBOLS = ['🎭', '🎨', '🎪', '🎢', '🎡', '🎮', '🎲', '🎯', 
                '🎱', '🎳', '🎸', '🎺', '🎻', '🎹', '🎷', '🎼'];

const Card = ({ value, isFlipped, isMatched, onClick }) => (
  <div 
    onClick={onClick}
    className={`aspect-[3/4] bg-green-900 border-2 border-yellow-400 rounded-lg cursor-pointer 
                transition-all duration-300 relative preserve-3d 
                ${isFlipped ? 'rotate-y-180' : ''} 
                ${isMatched ? 'opacity-50' : ''}`}
  >
    <div className="absolute w-full h-full backface-hidden flex items-center justify-center text-2xl text-yellow-400 bg-gradient-to-br from-green-800 to-green-900">
      ?
    </div>
    <div className="absolute w-full h-full backface-hidden flex items-center justify-center text-2xl text-yellow-400 bg-green-900 rotate-y-180">
      {value}
    </div>
  </div>
);

const SichuanGame = () => {
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
    <div className="max-w-4xl mx-auto p-8 bg-green-900 min-h-screen">
      <h1 className="text-4xl text-yellow-400 text-center mb-8 font-bold shadow-text">四川翻牌机</h1>
      
      <div className="flex justify-between mb-6 p-4 bg-black/30 rounded-lg text-white">
        <div>分数: {score}</div>
        <div>剩余配对: {remainingPairs}</div>
        <div>时间: {formatTime(gameTime)}</div>
      </div>

      <div className="grid grid-cols-8 gap-2 p-4 bg-black/20 rounded-lg mb-6">
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

      <button
        onClick={restartGame}
        className="bg-yellow-400 text-green-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
      >
        重新开始
      </button>

      {isGameOver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-green-800 p-6 rounded-lg text-white">
            <h2 className="text-2xl mb-4">游戏结束！</h2>
            <p>最终得分: {score}</p>
            <p>用时: {formatTime(gameTime)}</p>
            <button
              onClick={restartGame}
              className="mt-4 bg-yellow-400 text-green-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-300"
            >
              再来一局
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SichuanGame;