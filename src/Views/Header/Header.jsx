import { Link } from "react-router-dom";
import title from "../../../public/titleimg.svg";

const Header = ({ eventName }) => {
  return (
    <div className="bg-[#37456b]">
      <nav className="container mx-auto px-12 py-2 max-w-[700px] flex items-center justify-between ">
        <Link to="/">
          <div>
            <img src={title} alt="logo " />
          </div>
        </Link>
        <div>
          <h1 className="font-normal font-montserrat text-white text-xl">
            {eventName}
          </h1>
        </div>
        <div>
          <h1 className="font-normal font-montserrat text-white text-xl">
            kitty
          </h1>
        </div>
      </nav>
    </div>
  );
};

export default Header;
