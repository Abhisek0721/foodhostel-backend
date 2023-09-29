// import fileUpload from "express-fileupload";
// import path, { dirname } from "path";
// import { fileURLToPath } from "url";

// const getFilesNames = (files: any) => {
//     if (!files) {
//         return {
//           success: false,
//           message: "No file!"
//         };
//       }
    
//       let fileLists = Object.keys(files);
//       let fileNamesWithData = [];
//       for (let index = 0; index < fileLists.length; index++) {
//         let temp:{
//             imageName?: string;
//             file?: any
//         } = {};
//         temp.imageName = files[fileLists[index]]?.name;
//         temp.file = files[fileLists[index]];
//         fileNamesWithData.push(temp);
//       }
    
//       return {
//         success: true,
//         filesWithName: fileNamesWithData,
//       };
// }


// const saveFoodImages = async (files:fileUpload.FileArray) => {
//     return new Promise(async (resolve)=> {
//         let filesWithName = getFilesNames(files);
//         let fileNameList = [];
//         if(filesWithName.success){
//             for (const item of filesWithName.filesWithName) {
//                 // generating unique file name
//                 let fileName = 
//                   `${String(Date.now())+String((Math.round(Math.random()*10000)))}_${item.imageName}`;
//                   let temp:{
//                     imageName?: string;
//                     fileName?: string;
//                     file?: any
//                 } = {};
//                 try {
//                   item.file.mv(
//                     path.join(__dirname, `../../static/foodimages/${fileName}`),
//                   );
//                 } catch (error) {
//                   resolve({'success': false, 'fileNameList': fileNameList, 'error': error.stack});
//                 }
//                 temp.imageName = item.imageName;
//                 temp.fileName = fileName;
//                 fileNameList.push(temp);
//             };
//             resolve({'success': true, 'fileNameList': fileNameList});
//         }else{
//             resolve({'success': false, 'fileNameList': fileNameList});
//         }
//     });
// }

// export default saveFoodImages;
