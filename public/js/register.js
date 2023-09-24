/* RMIT University Vietnam
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

//Password contains at least one upper case letter, at least one lower case letter, at least one digit, at least one special letter in the set !@#$%^&*, NO other kind of characters, has a length from 8 to 20 characters

function isValidUsername(username) {
  // Regex for username: 8-15 characters, only letters and digits
  const regex = /^[a-zA-Z0-9]{8,15}$/;
  return regex.test(username);
}

function isValidPassword(password) {
  // Regex for password: 8-20 characters, at least one uppercase, one lowercase, one digit, and one special character
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  return regex.test(password);
}

function isValidPhone(phone) {
  const regex = /^\d{9,11}$/;
  return regex.test(phone);
}
const username = document.getElementById("username");
const password = document.getElementById("password");
const phone = document.getElementById("phone");
const form = document.getElementById("form");
const errorElement = document.getElementById("error");

form.addEventListener("submit", (e) => {
  let messages = [];
  if (!isValidUsername(username.value)) {
    messages.push(
      "Username contains 8-15 characters, only letters and digits allowed!!"
    );
  }
  if (!isValidPassword(password.value)) {
    messages.push(
      "Password must have 8-20 characters, including at least one uppercase, one lowercase, one digit, and one special character !!!"
    );
  }

  if (!isValidPhone(phone.value)) {
    messages.push("Wrong phone format (9-11 characters)");
  }

  if (messages.length > 0) {
    e.preventDefault();
    errorElement.innerText = messages.join("\n\n");
  }
});
// Preview IMG
const previewImage = (event) => {
  const imageFiles = event.target.files;
  const imageFilesLength = imageFiles.length;
  if (imageFilesLength > 0) {
    const imageSrc = URL.createObjectURL(imageFiles[0]);
    const imagePreviewElement = document.querySelector(
      "#preview-selected-image"
    );
    imagePreviewElement.src = imageSrc;
    imagePreviewElement.style.display = "block";
  }
};
