/*RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023B
Assessment: Assignment 2
Author/ID: 
Phan Anh Khoi S3980639
Tran Minh Hoang S3975086
Nguyen Thi Hoang Yen S3930002
Le Tuan Kiet S3965654
Tran Minh S3911737

Acknowledgment: 

TheCornerStore logo: Image generated using Bing Image Creator from the prompt lettermark logo for the TheCornerStore website

Images:
The Craft House (n.d.) Product images [product], The Craft House website, accessed 23 September, 2023. https://thecrafthouse.vn/

AConcept Vietnam (2021). Furniture images [furniture], AConcept Vietnam website. Accessed 20 September 2023. https://aconcept-vn.com/vi/

Amazon (n.d.). Product images [product], Amazon website. Accessed 20 September 2023.https://www.amazon.com/ 

Text in footer’s static pages: OpenAI (2023) ChatGPT (August 3 version) [Large language model], accessed 23 September, 2023. https://chat.openai.com

Product description:
The Craft House (n.d.) Product detail, The Craft House website, accessed 23 September, 2023. https://thecrafthouse.vn/

OpenAI (2023) ChatGPT (August 3 version) [Large language model], accessed 23 September, 2023. https://chat.openai.com
 */

// Mongoose

const mongoose = require("mongoose");
mongoose
    .connect(
        "mongodb+srv://mint:mint@corner-store.cbiyacl.mongodb.net/Store?retryWrites=true&w=majority"
    )
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((error) => console.log(error.message));

module.exports = mongoose;