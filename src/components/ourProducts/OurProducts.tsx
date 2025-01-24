import Image from "next/image";
import textBg from "../../../public/images/textBg.svg";
import OurProductsSlider from "../ourProductsSlider/OurProductsSlider";

const OurProducts = () => {
  return (
    <div id="ourProducts" className="relative">
      {/* Text */}
      <h2 className="text-3xl font-extrabold relative z-10">OUR PRODUCTS</h2>
      {/* Background Image */}
      <div className="absolute inset-0 left-32 top-4 items-end -z-10">
        <Image
          src={textBg}
          alt="Text Background"
          layout="intrinsic"
          width={120}
          height={25}
          objectFit="contain"
        />
      </div>
      <div className="mt-8">
        <OurProductsSlider></OurProductsSlider>
      </div>
    </div>
  );
};

export default OurProducts;
