import Image from "next/image";
import bannerImage from "../../../public/images/bannerImage.svg";
import textImage1 from "../../../public/images/Rectangle 3.svg";
import textImage2 from "../../../public/images/Rectangle 6.svg";

const Banner = () => {
  return (
    <div className="bg-bannerBg w-full lg:h-[700px] rounded-[50px] flex items-center px-4 sm:px-8">
      <div className="flex flex-col lg:flex-row w-full gap-5 lg:px-8">
        {/* Left side text */}
        <div className="lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
          <h2 className="text-[40px] sm:text-[60px] lg:text-[80px] font-extrabold relative">
            {/* Background Image */}
            <span className="absolute top-[10px] -left-[20px] z-0 hidden lg:block">
              <Image
                src={textImage1}
                alt="textImage1"
                height={100}
                width={380}
              />
            </span>
            {/* Foreground Text */}
            <span className="relative z-10">LET'S</span>
            <br /> EXPLORE
            <span className="absolute bottom-[125px] -left-[20px] z-0 hidden lg:block">
              <Image
                src={textImage2}
                alt="textImage2"
                height={100}
                width={380}
              />
            </span>
            <span className="relative ">
              <br /> UNIQUE
            </span>
            <br />
            CLOTHES.
          </h2>

          <p className="mt-5 text-lg sm:text-2xl">
            Live for Influential and Innovative fashion!
          </p>
          <div className="mt-5">
            <button className="bg-black text-white font-semibold px-5 py-2 rounded-md">
              Shop Now
            </button>
          </div>
        </div>
        {/* Right side image */}
        <div className="lg:w-1/2 flex justify-center items-center">
          <Image
            src={bannerImage}
            alt="bannerImage"
            layout="intrinsic"
            objectFit="contain"
            priority={true}
            className="w-full max-w-xs sm:max-w-md lg:max-w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
