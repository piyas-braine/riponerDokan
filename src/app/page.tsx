import Banner from "@/components/banner/Banner";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import OurProducts from "@/components/ourProducts/OurProducts";

export default function Home() {
  return (
    <div className="">
      <div className="py-2.5 px-6 mx-auto container ">
        <Navbar></Navbar>
      </div>
      <div className="mx-auto container p-6">
        <Banner></Banner>
      </div>
      <div className="p-6 mx-auto container mt-10">
        <OurProducts></OurProducts>
      </div>
      <div className=" mt-16">
        <Footer></Footer>
      </div>
    </div>
  );
}
