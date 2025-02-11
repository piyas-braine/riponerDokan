import Image from "next/image";
import bannerImage from "../../../public/images/hero-image.jpg";

const Banner = () => {
  return (
    <div className="relative w-full md:h-[600px] h-[300px]">
      <Image
        src={bannerImage}
        alt="bannerImage"
        layout="fill"
        className="w-full h-full lg:object-cover object-contain lg:object-top rounded-md"
      />
    </div>
  );
};

export default Banner;
