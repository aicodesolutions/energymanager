import React from 'react';

const BoltBadge: React.FC = () => {
  return (
    <a
      href="https://bolt.new"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block transition-transform duration-200 hover:scale-105 bolt-badge"
      aria-label="Built with Bolt.new"
    >
      <img
        src="/white_circle_360x360.png"
        alt="Built with Bolt.new"
        className="bolt-badge-image w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 drop-shadow-sm hover:drop-shadow-md transition-all duration-200"
        loading="lazy"
      />
    </a>
  );
};

export default BoltBadge;