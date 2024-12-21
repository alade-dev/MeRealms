import PropTypes from 'prop-types';

const RotatingMemes = ({ giphy2, giphy3, giphy4, giphy5, giphy6, giphy8 }) => {
  const orbitingMemes = [
    // { src: giphy2, alt: "Meme 1" },
    // { src: giphy3, alt: "Meme 2" },
    // { src: giphy4, alt: "Meme 3" },
    // { src: giphy6, alt: "Meme 4" },
    // { src: giphy8, alt: "Meme 5" },
  ];

  return (
    <div className="lg:w-1/2 relative w-full lg:flex hidden items-center lg:justify-center">
      {/* Main Meme GIF */}
      <img
        src={giphy5}
        alt="Main Meme"
        className="rounded-3xl  h-96 w-96 p-3 object-cover z-10"
      />
      {/* Orbiting Memes */}
      <div className="absolute h-[610px] w-[610px] animate-[rotate_30s_linear_infinite]">
        {orbitingMemes.map((meme, index) => {
          const angle = (index / orbitingMemes.length) * 2 * Math.PI;
          const top = 50 + 43 * Math.sin(angle);
          const left = 50 + 43 * Math.cos(angle);
          return (
            <img
              key={index}
              src={meme.src}
              alt={meme.alt}
              className="absolute h-28 w-28 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{
                top: `${top}%`,
                left: `${left}%`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

RotatingMemes.propTypes = {
    giphy2: PropTypes.string.isRequired,
    giphy3: PropTypes.string.isRequired,
    giphy4: PropTypes.string.isRequired,
    giphy5: PropTypes.string.isRequired,
    giphy6: PropTypes.string.isRequired,
    giphy8: PropTypes.string.isRequired,
  };

export default RotatingMemes;