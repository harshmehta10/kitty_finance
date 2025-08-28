import { Link } from "react-router-dom";
import title from "../../../public/titleimg.svg";

const Header = ({ eventName }) => {
  return (
    <div className="bg-[#37456b]">
      <nav className="container mx-auto px-6 lg:px-12 py-1 lg:py-2 max-w-[700px] flex items-center justify-between ">
        <Link to="/">
          <div>
            <img src={title} alt="logo" className="size-10 lg:size-full" />
          </div>
        </Link>
        <div>
          <h1 className="font-normal font-montserrat text-white text-base lg:text-xl">
            {eventName ? eventName : "Loading..."}
          </h1>
        </div>
        <div>
          <h1 className="font-normal font-montserrat text-white text-base lg:text-xl">
            kitty
          </h1>
        </div>
      </nav>
    </div>
  );
};

export default Header;
