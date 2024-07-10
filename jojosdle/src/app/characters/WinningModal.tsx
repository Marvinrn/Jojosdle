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

  return (
    <div className="winningModal">
      <div className="winningModal__content">
        <h2>{character.name}</h2>
        <Image
          src={character.image}
          alt={character.name}
          width={100}
          height={100}
        />
      </div>
      <button className="winningModal__replayBtn">rejouer</button>
    </div>
  );
};

export default WinningModal;
