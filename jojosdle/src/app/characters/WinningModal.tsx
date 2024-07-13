import React, { useEffect, useState } from "react";
import Image from "next/image";

interface WinningModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: {
    name: string;
    image: string;
  } | null;
}

const WinningModal: React.FC<WinningModalProps> = ({
  isOpen,
  onClose,
  character,
}) => {
  const [attemptCount, setAttemptCount] = useState<number>(0);

  useEffect(() => {
    if (isOpen && localStorage.getItem("displayedCharacters")) {
      const displayedCharacters = JSON.parse(
        localStorage.getItem("displayedCharacters")!
      );
      setAttemptCount(displayedCharacters.length);
    }
  }, [isOpen]);

  const handleReplayClick = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (!isOpen || !character) return null;

  return (
    <div className="winningModal">
      <div className="winningModal__content">
        <h2>{character.name}</h2>
        <Image
          src={character.image}
          alt={character.name}
          width={150}
          height={150}
        />
        <p>Number of attempts: {attemptCount}</p>
      </div>
      <button className="winningModal__replayBtn" onClick={handleReplayClick}>
        rejouer
      </button>
    </div>
  );
};

export default WinningModal;
