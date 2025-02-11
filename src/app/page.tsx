import Banner from "@/components/banner/Banner";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import OurProducts from "@/components/ourProducts/OurProducts";

export default function Home() {
  return (
    <div className="">
      <div className="lg:py-2.5 py-1 px-6 mx-auto container ">
        <Navbar></Navbar>
      </div>
      <div className="mx-auto container lg:p-6  px-6">
        <Banner></Banner>
      </div>
      <div className="lg:p-6 px-6 mx-auto container lg:mt-10 mt-4">
        <OurProducts></OurProducts>
      </div>
      <div className=" mt-16">
        <Footer></Footer>
      </div>
    </div>
  );
}
