import React, { useState } from "react";
import RulesModal from "./RulesModal";

interface CharacterSearchInputProps {
  searchQuery: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchDisabled: boolean;
}

const CharacterSearchInput: React.FC<CharacterSearchInputProps> = ({
  searchQuery,
  handleSearchChange,
  searchDisabled,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInfoClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="searchBarContainer">
      <div className="wrapper">
        <input
          className="searchBar"
          type="text"
          placeholder="Search character..."
          value={searchQuery}
          onChange={handleSearchChange}
          disabled={searchDisabled}
        />
        <label htmlFor="search">Search character...</label>
      </div>
      <button className="infoBtn" onClick={handleInfoClick}>
        i<span className="hoverText">show rules</span>
      </button>
      {isModalOpen && <RulesModal onClose={handleCloseModal} />}
    </div>
  );
};

export default CharacterSearchInput;
