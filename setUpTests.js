import "@testing-library/jest-dom/extend-expect";
import "regenerator-runtime/runtime";

import Enzyme from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { shallow } from "enzyme";

global.shallow = shallow;
Enzyme.configure({ adapter: new Adapter() });

global.window = {
  location: {
    pathname: "/",
  },
  innerWidth: 1200,
  addEventListener: new Function(),
};
