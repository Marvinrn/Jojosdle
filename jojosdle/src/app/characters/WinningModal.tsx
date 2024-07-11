import React from "react";
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
  if (!isOpen || !character) return null;

  const handleReplayClick = () => {
    window.location.reload();
  };

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
      </div>
      <button className="winningModal__replayBtn" onClick={handleReplayClick}>
        rejouer
      </button>
    </div>
  );
};

export default WinningModal;
