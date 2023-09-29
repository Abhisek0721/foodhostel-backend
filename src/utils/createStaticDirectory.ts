import fs from "fs";


const generateStaticDirectory = () => {
    if (fs.existsSync("./static")) {
        if (!fs.existsSync("./static/foodimages")) {
          console.log(`Creating Path: ./static/foodimages`);
          fs.mkdirSync("./static/foodimages");
        }
        if (!fs.existsSync("./static/media")) {
          console.log(`Creating Path: ./static/media`);
          fs.mkdirSync("./static/media");
        }
      } else {
        console.log(`Creating Path: ./static/foodimages`);
        fs.mkdirSync("./static");
        fs.mkdirSync("./static/foodimages");
      }
}

export default generateStaticDirectory;

