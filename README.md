# RestAssured Code Generator

## Overview

The **RestAssured Code Generator** is a simple Next.js application designed to streamline the process of generating RestAssured test code. By inputting the necessary parameters, users can quickly obtain a code snippet that can be used to test APIs. This single-page application focuses on simplicity and efficiency, making it easier for users to create test cases without unnecessary complexity.

## Features

- **Input Fields**:
  - **Base URL**: Text box for entering the base URL of the API.
  - **API Endpoint**: Text box for entering the specific API endpoint.
  - **Query Parameters**: Two text boxes (key and value) with a "+" button to add more parameters as needed.
  - **Path Parameters**: Text box for entering path parameters with a "+" button to add additional parameters.
  - **Headers**: Similar to query parameters, allows for key-value pairs with the option to add more.
  - **Request Body**: A dropdown to choose between JSON and form-data formats, along with an appropriate text area for input.
  - **Expected Status Code**: A searchable dropdown listing all possible HTTP status codes.

- **User Interface**: 
  - The left side of the application contains all input fields for user convenience.
  - The right side displays the generated RestAssured code snippet along with a "Copy Code" button.

- **Code Generation**: 
  - On clicking the "Generate Code" button, the application compiles all the input data into a well-structured RestAssured test code.

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm (version 5.6 or later)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/osandadeshan/rest-assured-code-generator.git
   cd rest-assured-code-generator
   ```

2. Install the dependencies:

  ```bash
  npm install
  ```

3. Start the development server:

  ```bash
  npm run dev
  ```

4. Open your web browser and navigate to `http://localhost:3000` to view the application.

## Usage
1. Enter the **Base URL** and **API Endpoint** in the provided text boxes.
2. Add **Query Parameters** and **Path Parameters** using the "+" buttons.
3. Enter any necessary **Headers**.
4. Select the appropriate **Request Body Type (JSON or form-data)** and provide the body content if required.
5. Enter the **Expected Status Code**.
6. Click the **Generate Code** button to create the RestAssured test code.
7. Use the **Copy Code** button to easily copy the generated code to your clipboard for further use.

## Technologies Used
- Next.js
- React
- TypeScript
- CSS (for styling)

## Sample Application

A sample version of the application is deployed on [Vercel](https://vercel.com/). You can try it out [here](https://rest-assured-code-generator.vercel.app/).

## License
This project is licensed under the MIT License. You are free to use, modify, and distribute this software under the terms of the license.

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/License_icon-mit-2.svg/2000px-License_icon-mit-2.svg.png" alt="MIT License" width="100" height="100"/> [MIT License](https://opensource.org/licenses/MIT)

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## Acknowledgements
- Inspired by the need for efficient API testing and automation.
- Thanks to the open-source community for their valuable tools and resources.
