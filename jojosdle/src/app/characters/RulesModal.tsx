import React, { useEffect, useRef, useCallback } from "react";

interface RulesModalProps {
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="modal">
      <div className="modalContent" ref={modalRef}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2 className="rulesTitle">Rules</h2>
        <p className="rulesIntro">
          The goal of the game is to guess a specific character from{" "}
          <em>
            <strong>JoJo&apos;s Bizarre Adventure</strong>
          </em>
          .
        </p>
        <p className="rulesHowToPlay">
          <strong>How to Play:</strong>
        </p>
        <ul className="rulesList">
          <li className="rulesListItem">
            Enter the name of a character from{" "}
            <em>
              <strong>JoJo&apos;s Bizarre Adventure</strong>
            </em>{" "}
            (up to Part 6: Stone Ocean).
          </li>
          <li className="rulesListItem">
            A list of properties will appear for the entered character, each
            with a background color indicating the match status:
          </li>
          <ul className="propertyList">
            <li className="propertyListItem">
              <span className="red">Red</span>: The property does not match the
              character to guess.
            </li>
            <li className="propertyListItem">
              <span className="orange">Orange</span>: The property partially
              matches.
            </li>
            <li className="propertyListItem">
              <span className="green">Green</span>: The property matches
              perfectly.
            </li>
          </ul>
          <li className="rulesListItem">
            For the &quot;First Appearance&quot; property, an arrow will
            indicate if the guessed character appears before or after the target
            character.
          </li>
          <li className="rulesListItem">
            The game is restricted to characters up to Part 6: Stone Ocean to
            avoid any spoilers for anime-only players.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RulesModal;
