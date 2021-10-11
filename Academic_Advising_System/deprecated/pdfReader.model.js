// const t = require('tesseract.js');
// const pdf = require('pdf-parse');
// const { createWorker, createScheduler } = require('tesseract.js');
// const ocrSpace = require('ocr-space-api-wrapper')

// //////************************** tesseract.js OCR ********************/////////////////////
//         // clean the text from eng text and nums and special chars
//
//     function clean(str) {
//         return str.replace(/[A-Za-z.@|(),“١\-#_\/"\[\]\\]/g, "")
//     }
//     //
//     async function basic(){
//     const worker = t.createWorker({
//         logger: m => console.log(m), // Add logger here
//     });
//         await worker.load();
//         await worker.loadLanguage('ara+eng');
//         await worker.initialize('ara+eng');
//          const { data: { text } } = await worker.recognize('./public/assets/img/test.png');
//
//         //test
//         let cleaned = clean(text)
//         // put into array and reverse to see in console for testing purposes only//
//             const arrayForm = [...cleaned];
//             let rotated = arrayForm.reverse().join("");
//             console.log(rotated);
//         await worker.terminate();
//     };

//
//
// //***************************** PDF-Parser   ****************************************//
//
//     let dataBuffer = fs.readFileSync('./public/assets/img/test.pdf');
//
//    await pdf(dataBuffer).then(function(data) {
//
//        fs.writeFileSync('./public/assets/img/test.txt', data.text, err => {
//            if (err) {
//                console.error(err)
//            }
//        })
//         // number of pages
//         console.log(data.numpages);
//         // number of rendered pages
//         console.log(data.numrender);
//         // PDF info
//         console.log(data.info);
//         // PDF metadata
//         console.log(data.metadata);
//         // PDF.js version
//         // check https://mozilla.github.io/pdf.js/getting_started/
//         console.log(data.version);
//         // PDF text
//         console.log(data.text);
//     });


//*************************** parallel OCR ****************//

// const scheduler = createScheduler();
// async function ss()  {
// let arr = [];
//     for (let i=0;i<10;i++) {
//         arr.push(createWorker());
//         await arr[i].load();
//         await arr[i].loadLanguage('eng+ara');
//         await arr[i].initialize('eng+ara');
//         scheduler.addWorker(arr[i]);
//     }
//
//     /** Add 10 recognition jobs */
//
//     // const results
//     const results = await Promise.all(Array(10).fill(0).map(() => (
//         scheduler.addJob('recognize', './public/assets/img/test.png')
//     )))
//
//     console.log(results);
//     await scheduler.terminate(); // It also terminates all workers.
//     console.log(`arr ${arrayFunStart - arrayend} milliseconds`)
// };




// ********************** ocrSpace **************** //

// async function main () {
//     try {
//         // // Using the OCR.space default free token + remote file
//         // const res1 = await ocrSpace('http://dl.a9t9.com/ocrbenchmark/eng.png')
//
//         // // Using your personal token + local file
//         const res2 = await ocrSpace('./public/assets/img/test.pdf', { apiKey: '7e712f499688957', language: 'ara' })
//         //
//         // Using your personal token + base64 image + custom language
//         // const res3 = await ocrSpace('./pubic/assets/img/test.png', { apiKey: '7e712f499688957', language: 'ara' })
//         console.log(res2);
//         // console.log(res3)
//         // console.log(res1)
//     } catch (error) {
//         console.log(error)
//     }
