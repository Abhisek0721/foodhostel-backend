import path from "path";

class SellerClass {
    public static saveFoodImage(imageFiles:any) {
        const fileName = `${Date.now()}_${imageFiles?.name}`;
        imageFiles.mv(
          path.join(__dirname, `../../../static/foodimages/${fileName}`),
        );
        return fileName;
    }
}

export default SellerClass;