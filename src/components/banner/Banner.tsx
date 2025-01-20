import Image from "next/image";
import bannerImage from "../../../public/images/bannerImage.svg";
import textImage1 from "../../../public/images/Rectangle 3.svg";
import textImage2 from "../../../public/images/Rectangle 6.svg";

const Banner = () => {
  return (
    <div className="bg-bannerBg w-full lg:h-[700px] rounded-[50px] flex items-center">
      <div className="px-16 flex w-full gap-5">
        {/* Left side text */}
        <div className="w-1/2 flex flex-col justify-center">
          <h2 className="text-[80px] font-extrabold relative">
            {/* Background Image */}
            <span className="absolute top-[10px] -left-[20px] z-0">
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
            <span className="absolute bottom-[125px] -left-[20px] z-0">
              <Image
                src={textImage2}
                alt="textImage2"
                height={100}
                width={380}
              />
            </span>
            <span className="relative ">UNIQUE</span>
            <br />
            CLOTHES.
          </h2>

          <p className="mt-5 text-2xl">
            Live for Influential and Innovative fashion!
          </p>
          <div className="mt-5">
            <button className="bg-black text-white font-semibold px-5 py-2 rounded-md">
              Shop Now
            </button>
          </div>
        </div>
        {/* Right side image */}
        <div className="w-1/2 flex items-end">
          <Image
            src={bannerImage}
            alt="bannerImage"
            layout="intrinsic"
            objectFit="contain"
            priority={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
