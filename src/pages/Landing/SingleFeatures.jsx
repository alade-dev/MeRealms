/* eslint-disable react/prop-types */
import { Vote } from "lucide-react";

const SingleFeatures = ({ token, handleTokenClick }) => {
  const { projects } = token;
  return (
    <>
      {projects.map((project, index) => (
        <>
          <div
            key={index}
            onClick={() => handleTokenClick(project)}
            className="flex items-center space-x-4"
          >
            <div className="relative w-full sm:w-auto">
              <img
                src={project.image}
                alt={project.name}
                className="w-full lg:w-[200px] h-[170px] object-cover rounded-lg"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2 text-center">
                <h3 className="text-xs -ml-1 font-bold">{project.name}</h3>
              </div>
            </div>
          </div>
          <p className="text-sm text-[#D9D9D9]">{project.createdBy}</p>
          <p className="text-sm text-[#D9D9D9]">{project.voters}</p>
          <p
            className={`text-sm font-bold ${
              project.status === "Live" ? "text-green-500" : "text-[#b53030]"
            }`}
          >
            {project.status}
          </p>

          <button
            onClick={() => handleTokenClick(project)}
            className="bg-blue-500 text-white py-4 px-4 rounded-md font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Vote</span>
            <Vote alt="vote" className="w-5 h-5 object-contain" />
          </button>
        </>
      ))}
    </>
  );
};

export default SingleFeatures;