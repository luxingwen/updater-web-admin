import { useState } from 'react';

interface NestedNavProps {
  navItems: string[];
  onNavItemClick: (index: number) => void;
}

const NestedNav: React.FC<NestedNavProps> = ({ navItems, onNavItemClick }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNavItemClick = (index: number) => {
    setSelectedIndex(index);
    onNavItemClick(index);
  };

  return (
    <div>
      {navItems.map((item, index) => (
        <a
          key={index}
          href={`#${item}`}
          onClick={() => handleNavItemClick(index)}
          style={{
            fontWeight: selectedIndex === index ? 'bold' : 'normal',
          }}
        >
          / {item}
        </a>
      ))}
    </div>
  );
};

export default NestedNav;
