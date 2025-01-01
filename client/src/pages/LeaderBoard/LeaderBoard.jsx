import { useEffect, useState } from "react";
import { Crown, Trophy, Medal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMemes } from "../../contractAPI";

const LeaderboardPage = () => {
  const [allProjects, setAllProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const memes = await getMemes();
        const sortedMemes = memes
          .flatMap((category) =>
            category.projects.map((project) => ({
              ...project,
              voters: parseInt(project.voters.replace("k", "000")),
            }))
          )
          .sort((a, b) => b.voters - a.voters);
        setAllProjects(sortedMemes);
      } catch (error) {
        console.error("Error fetching memes:", error);
      }
    };

    fetchMemes();
  }, []);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-700" />;
      default:
        return null;
    }
  };

  const handleTokenClick = (project) => {
    // console.log(project);
    navigate(`/meme/${project.name}`, { state: { projectData: project } });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-12">
          LEADERBOARD
        </h1>

        {/* Top 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {allProjects.slice(0, 3).map((project, index) => (
            <div
              key={index}
              onClick={() => handleTokenClick(project)}
              className="relative cursor-pointer bg-white/10 backdrop-blur-lg rounded-2xl p-6 flex flex-col items-center text-white border border-white/20"
            >
              <div className="absolute -top-4">{getRankIcon(index)}</div>
              <img
                src={project.image}
                alt={project.name}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold">{project.name}</h3>
              <p className="text-sm opacity-75">{project.createdBy}</p>
              <p className="text-2xl font-bold mt-4">
                {project.voters.toLocaleString()} votes
              </p>
            </div>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-white border-b border-white/20">
                <th className="py-4 px-6 text-left">Rank</th>
                <th className="py-4 px-6 text-left">Project</th>
                <th className="py-4 px-6 text-left">Creator</th>
                <th className="py-4 px-6 text-right">Votes</th>
              </tr>
            </thead>
            <tbody>
              {allProjects.slice(3).map((project, index) => (
                <tr
                  key={index + 3}
                  onClick={() => handleTokenClick(project)}
                  className="text-white border-b cursor-pointer border-white/10 hover:bg-white/5"
                >
                  <td className="py-4 px-6 font-semibold">{index + 4}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {project.name}
                    </div>
                  </td>
                  <td className="py-4 px-6">{project.createdBy}</td>
                  <td className="py-4 px-6 text-right">
                    {project.voters.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
