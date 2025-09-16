import "styled-components";
import { Theme } from "./theme";

declare module "styled-components" {
  export interface DefaultTheme extends Theme {
    colors: Theme["colors"];
    fonts: Theme["fonts"];
    fontSizes: Theme["fontSizes"];
    fontWeights: Theme["fontWeights"];
    lineHeights: Theme["lineHeights"];
    space: Theme["space"];
  }
}
