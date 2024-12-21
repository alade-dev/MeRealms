const Footer = () => {
    return (
      <footer className="bg-black/30 text-white py-2">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-xs mb-1">
            At MeRealms, it&apos;s all about community, creativity, and memes—join us and be part of the decentralized meme revolution!
          </p>
          <div className="text-center text-xs opacity-80">
            © Copyright {new Date().getFullYear()} All rights reserved
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer