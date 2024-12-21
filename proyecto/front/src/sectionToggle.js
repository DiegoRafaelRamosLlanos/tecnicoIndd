// sectionToggle.js
import { useState } from "react";

const useSectionToggle = () => {
  const [activeSection, setActiveSection] = useState(null);

  const handleSectionToggle = (section) => {
    setActiveSection(prevSection => (prevSection === section ? null : section));
  };

  return { activeSection, handleSectionToggle };
};

export default useSectionToggle;
