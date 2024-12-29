import Hero from "./Hero1";

import Feature from "./Features1";

// import search from "../../assets/icons/search.png";

const Index = () => {
  return (
    <div>
      {/* <div className="absolute lg:z-50 lg:top-3 lg:left-[35%] hidden lg:inline-block bg-[#2d2d35] rounded-md w-[429px] px-4 py-2 border border-transparent hover:border-gray-500 focus-within:border-gray-500 transition-colors">
       
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent text-white placeholder-gray-400 pr-10 my-2 focus:outline-none w-full"
        />

        <img
          src={search}
          alt="search"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
        />
      </div> */}
      <Hero />

      <Feature />
    </div>
  );
};

export default Index;
