import Image from "next/image";
import bannerImage from "../../../public/images/hero-image.jpg";

const Banner = () => {
  return (
    <div className="relative w-full h-[600px]">
      <Image
        src={bannerImage}
        alt="bannerImage"
        layout="fill"
        className="w-full h-full object-cover object-top rounded-md"
      />
    </div>
  );
};

export default Banner;
