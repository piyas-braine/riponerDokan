import Image from "next/image";
import bannerImage from "../../../public/images/BannerGhee.png";
import textImage1 from "../../../public/images/Rectangle 3.svg";
import textImage2 from "../../../public/images/Rectangle 6.svg";

const Banner = () => {
  return (
    <div className="bg-bannerBg w-full rounded-[50px] flex flex-col lg:flex-row items-center px-4 sm:px-8 py-8 lg:py-0">
      <div className="flex flex-col lg:flex-row w-full gap-5 lg:px-8">
        {/* Left side text */}
        <div className="lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
          <h2 className="text-[32px] sm:text-[48px] lg:text-[64px] xl:text-[80px] font-extrabold relative leading-tight">
            {/* Background Image */}
            <span className="absolute top-[10px] -left-[20px] z-0 hidden lg:block">
              <Image
                src={textImage1}
                alt="textImage1"
                width={320}
                height={80}
              />
            </span>
            {/* Foreground Text */}
            <span className="relative z-10">LETS</span>
            <br /> EXPLORE
            <span className="absolute bottom-[85px] -left-[20px] z-0 hidden lg:block">
              <Image
                src={textImage2}
                alt="textImage2"
                width={320}
                height={80}
              />
            </span>
            <span className="relative">
              <br /> UNIQUE
            </span>
            <br />
            GHEE.
          </h2>

          <p className="mt-5 text-base sm:text-lg lg:text-xl">
            Best Ghee in the Town!
          </p>
          <div className="mt-5">
            <a
              href="#ourProducts"
              className="bg-black text-white font-semibold px-5 py-2 rounded-md inline-block"
            >
              Shop Now
            </a>
          </div>
        </div>

        {/* Right side image */}
        <div className="lg:w-1/2 flex justify-center items-center">
          <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
            <Image
              src={bannerImage}
              alt="bannerImage"
              width={500}
              height={500}
              objectFit="contain"
              priority={true}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
