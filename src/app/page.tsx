"use client";

import { useRef, useState } from "react";
import Select from "react-select";
import "./styles.css"; // Importing the external CSS file

interface StatusOption {
  value: string;
  label: string;
}

const statusCodes: StatusOption[] = [
  { value: "100", label: "100 Continue" },
  { value: "101", label: "101 Switching Protocols" },
  { value: "200", label: "200 OK" },
  { value: "201", label: "201 Created" },
  { value: "202", label: "202 Accepted" },
  { value: "203", label: "203 Non-Authoritative Information" },
  { value: "204", label: "204 No Content" },
  { value: "205", label: "205 Reset Content" },
  { value: "206", label: "206 Partial Content" },
  { value: "300", label: "300 Multiple Choices" },
  { value: "301", label: "301 Moved Permanently" },
  { value: "302", label: "302 Found" },
  { value: "303", label: "303 See Other" },
  { value: "304", label: "304 Not Modified" },
  { value: "305", label: "305 Use Proxy" },
  { value: "307", label: "307 Temporary Redirect" },
  { value: "308", label: "308 Permanent Redirect" },
  { value: "400", label: "400 Bad Request" },
  { value: "401", label: "401 Unauthorized" },
  { value: "402", label: "402 Payment Required" },
  { value: "403", label: "403 Forbidden" },
  { value: "404", label: "404 Not Found" },
  { value: "405", label: "405 Method Not Allowed" },
  { value: "406", label: "406 Not Acceptable" },
  { value: "407", label: "407 Proxy Authentication Required" },
  { value: "408", label: "408 Request Timeout" },
  { value: "409", label: "409 Conflict" },
  { value: "410", label: "410 Gone" },
  { value: "411", label: "411 Length Required" },
  { value: "412", label: "412 Precondition Failed" },
  { value: "413", label: "413 Payload Too Large" },
  { value: "414", label: "414 URI Too Long" },
  { value: "415", label: "415 Unsupported Media Type" },
  { value: "416", label: "416 Range Not Satisfiable" },
  { value: "417", label: "417 Expectation Failed" },
  { value: "426", label: "426 Upgrade Required" },
  { value: "500", label: "500 Internal Server Error" },
  { value: "501", label: "501 Not Implemented" },
  { value: "502", label: "502 Bad Gateway" },
  { value: "503", label: "503 Service Unavailable" },
  { value: "504", label: "504 Gateway Timeout" },
  { value: "505", label: "505 HTTP Version Not Supported" },
];

export default function Home() {
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [queryParams, setQueryParams] = useState([{ key: "", value: "" }]);
  const [pathParams, setPathParams] = useState([{ key: "", value: "" }]);
  const [formData, setFormData] = useState([{ key: "", value: "" }]);
  const [requestBodyType, setRequestBodyType] = useState("JSON");
  const [jsonBody, setJsonBody] = useState("");
  const [httpMethod, setHttpMethod] = useState("GET");
  const [expectedStatusCode, setExpectedStatusCode] = useState<string>("");
  const codeBlockRef = useRef<HTMLDivElement>(null);
  const [copyMessage, setCopyMessage] = useState("");

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
  };

  const addQueryParam = () => {
    setQueryParams([...queryParams, { key: "", value: "" }]);
  };

  const removeQueryParam = (index: number) => {
    const newQueryParams = queryParams.filter((_, i) => i !== index);
    setQueryParams(newQueryParams);
  };

  const addPathParam = () => {
    setPathParams([...pathParams, { key: "", value: "" }]);
  };

  const removePathParam = (index: number) => {
    const newPathParams = pathParams.filter((_, i) => i !== index);
    setPathParams(newPathParams);
  };

  const addFormData = () => {
    setFormData([...formData, { key: "", value: "" }]);
  };

  const removeFormData = (index: number) => {
    const newFormData = formData.filter((_, i) => i !== index);
    setFormData(newFormData);
  };

  const handleStatusChange = (selectedOption: StatusOption | null) => {
    setExpectedStatusCode(selectedOption ? selectedOption.value : "");
  };

  const handleGenerateCode = () => {
    const intendation = "                  ";
    const baseUrlInput = document.querySelector(
      'input[placeholder="Base URL"]'
    ) as HTMLInputElement | null;
    const apiEndpointInput = document.querySelector(
      'input[placeholder="API Endpoint"]'
    ) as HTMLInputElement | null;
    const codeBlock = document.querySelector(".code-block");

    if (!baseUrlInput || !apiEndpointInput || !codeBlock) {
      console.error("One or more elements are missing.");
      return;
    }

    const baseUrl = baseUrlInput.value.trim();
    const apiEndpoint = apiEndpointInput.value.trim();

    // Path Parameters
    const pathParamPlaceholders = pathParams
      .filter((param) => param.key)
      .map((param) => `{${param.key}}`)
      .join("/");

    const pathParamStrings = pathParams
      .filter((param) => param.key)
      .map((param) => `.addPathParam("${param.key}", "${param.value}")`)
      .join(`\n${intendation}`); // Adjusted indentation

    // Query Parameters
    const queryParamStrings = queryParams
      .filter((param) => param.key && param.value)
      .map((param) => `.addQueryParam("${param.key}", "${param.value}")`)
      .join(`\n${intendation}`); // Adjusted indentation

    // Headers
    const headerStrings = headers
      .filter((header) => header.key && header.value)
      .map((header) => `.addHeader("${header.key}", "${header.value}")`)
      .join(`\n${intendation}`); // Adjusted indentation

    // Request Body for JSON
    const bodyContent = jsonBody
      .replace(/\\/g, "\\\\") // Escape backslashes
      .replace(/"/g, '\\"') // Escape quotes
      .replace(/\n/g, "\\n"); // Replace new lines with \n

    const formattedBody = `"${bodyContent}"`;

    // Generate the full Java class with imports
    let restAssuredCode = `
  <pre>
  <span class="keyword">import</span> io.restassured.RestAssured;
  <span class="keyword">import</span> io.restassured.builder.RequestSpecBuilder;
  <span class="keyword">import</span> io.restassured.http.ContentType;
  <span class="keyword">import</span> org.testng.annotations.Test;
  
  <span class="keyword">public</span> <span class="keyword">class</span> ApiTest {
      <span class="keyword">@Test</span>
      <span class="keyword">public</span> <span class="keyword">void</span> <span class="function">testApi()</span> {
          RequestSpecBuilder requestSpecBuilder = <span class="keyword">new</span> RequestSpecBuilder()
                  .setBaseUri("${baseUrl}")   <span class="comment">// Set API base url</span>
                  .setBasePath("${apiEndpoint}${
      pathParamPlaceholders ? "/" + pathParamPlaceholders : ""
    }")   <span class="comment">// Set endpoint with path parameters</span>
                  ${
                    pathParamStrings
                      ? `\n${intendation}` +
                        pathParamStrings +
                        `   <span class="comment">// Add path parameters</span>`
                      : ""
                  }
                  ${
                    queryParamStrings
                      ? `\n${intendation}` +
                        queryParamStrings +
                        `  <span class="comment">// Add query parameters</span>`
                      : ""
                  }
                  ${
                    headerStrings
                      ? `\n${intendation}` +
                        headerStrings +
                        `  <span class="comment">// Add headers</span>`
                      : ""
                  }
                  .setContentType(ContentType.${
                    requestBodyType === "JSON" ? "JSON" : "MULTIPART"
                  })   <span class="comment">// Set Content-Type header</span>
                  .setAccept(ContentType.ANY)   <span class="comment">// Set Accept header</span>
                  ${
                    requestBodyType === "JSON"
                      ? `\n${intendation}.setBody(${formattedBody})`
                      : formData
                          .map(
                            (param) =>
                              `\n${intendation}.addMultiPart("${param.key}", "${param.value}")`
                          )
                          .join("")
                  };
          
          RestAssured
                  .given(requestSpecBuilder.build()).log().all()
                  .when()
                  .${httpMethod.toLowerCase()}()
                  .then().log().all()
                  .statusCode(${
                    expectedStatusCode || 200
                  }); <span class="comment">// Validate expected status code</span>
      }
  }
  </pre>
  `;

    // Display the generated code
    codeBlock.innerHTML = restAssuredCode; // Use innerHTML to allow HTML tags
  };

  const handleCopyCode = () => {
    if (codeBlockRef.current) {
      const code = codeBlockRef.current.innerText.trim();
      if (code) {
        navigator.clipboard
          .writeText(code)
          .then(() => {
            setCopyMessage("Code copied to clipboard!");
            setTimeout(() => setCopyMessage(""), 3000); // Clear message after 3 seconds
          })
          .catch((err) => {
            console.error("Could not copy text: ", err);
          });
      } else {
        setCopyMessage("Code block is empty!");
        setTimeout(() => setCopyMessage(""), 3000); // Clear message after 3 seconds
      }
    }
  };

  return (
    <div className="container">
      <div className="left-pane">
        <h1 className="title">REST Assured Code Generator</h1>

        {/* Request Parameters Section */}
        <div className="request-parameters">
          <h2>Request Parameters</h2>

          <label className="label">Base URL:</label>
          <input type="text" className="input" placeholder="https://restful-booker.herokuapp.com" />

          <label className="label">API Endpoint:</label>
          <input type="text" className="input" placeholder="/auth" />

          <label className="label">HTTP Method:</label>
          <select
            className="input"
            value={httpMethod}
            onChange={(e) => setHttpMethod(e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>

          <label className="label">Path Parameters:</label>
          {pathParams.map((param, index) => (
            <div key={index} className="input-group">
              <input
                type="text"
                className="input"
                value={param.key}
                onChange={(e) => {
                  const newPathParams = [...pathParams];
                  newPathParams[index].key = e.target.value;
                  setPathParams(newPathParams);
                }}
                placeholder="Key"
              />
              <input
                type="text"
                className="input"
                value={param.value}
                onChange={(e) => {
                  const newPathParams = [...pathParams];
                  newPathParams[index].value = e.target.value;
                  setPathParams(newPathParams);
                }}
                placeholder="Value"
              />
              <button
                className="delete-button"
                onClick={() => removePathParam(index)}
              >
                Delete
              </button>
            </div>
          ))}
          <button className="add-button" onClick={addPathParam}>
            Add Path Parameter
          </button>

          <label className="label">Query Parameters:</label>
          {queryParams.map((param, index) => (
            <div key={index} className="input-group">
              <input
                type="text"
                className="input"
                value={param.key}
                onChange={(e) => {
                  const newQueryParams = [...queryParams];
                  newQueryParams[index].key = e.target.value;
                  setQueryParams(newQueryParams);
                }}
                placeholder="Key"
              />
              <input
                type="text"
                className="input"
                value={param.value}
                onChange={(e) => {
                  const newQueryParams = [...queryParams];
                  newQueryParams[index].value = e.target.value;
                  setQueryParams(newQueryParams);
                }}
                placeholder="Value"
              />
              <button
                className="delete-button"
                onClick={() => removeQueryParam(index)}
              >
                Delete
              </button>
            </div>
          ))}
          <button className="add-button" onClick={addQueryParam}>
            Add Query Parameter
          </button>

          <label className="label">Headers:</label>
          {headers.map((param, index) => (
            <div key={index} className="input-group">
              <input
                type="text"
                className="input"
                value={param.key}
                onChange={(e) => {
                  const newHeaders = [...headers];
                  newHeaders[index].key = e.target.value;
                  setHeaders(newHeaders);
                }}
                placeholder="Key"
              />
              <input
                type="text"
                className="input"
                value={param.value}
                onChange={(e) => {
                  const newHeaders = [...headers];
                  newHeaders[index].value = e.target.value;
                  setHeaders(newHeaders);
                }}
                placeholder="Value"
              />
              <button
                className="delete-button"
                onClick={() => removeHeader(index)}
              >
                Delete
              </button>
            </div>
          ))}
          <button className="add-button" onClick={addHeader}>
            Add Header
          </button>

          <label className="label">Request Body Type:</label>
          <select
            className="input"
            value={requestBodyType}
            onChange={(e) => setRequestBodyType(e.target.value)}
          >
            <option value="JSON">JSON</option>
            <option value="form-data">Form Data</option>
          </select>

          {requestBodyType === "JSON" && (
            <>
              <label className="label">JSON Request Body:</label>
              <textarea
                className="textarea"
                value={jsonBody}
                onChange={(e) => setJsonBody(e.target.value)}
                placeholder='{"key": "value"}'
              />
            </>
          )}

          {requestBodyType === "form-data" && (
            <div>
              <label className="label">Form Data:</label>
              {formData.map((param, index) => (
                <div key={index} className="input-group">
                  <input
                    type="text"
                    className="input"
                    value={param.key}
                    onChange={(e) => {
                      const newFormData = [...formData];
                      newFormData[index].key = e.target.value;
                      setFormData(newFormData);
                    }}
                    placeholder="Key"
                  />
                  <input
                    type="text"
                    className="input"
                    value={param.value}
                    onChange={(e) => {
                      const newFormData = [...formData];
                      newFormData[index].value = e.target.value;
                      setFormData(newFormData);
                    }}
                    placeholder="Value"
                  />
                  <button
                    className="delete-button"
                    onClick={() => removeFormData(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button className="add-button" onClick={addFormData}>
                Add Form Data
              </button>
            </div>
          )}
        </div>

        {/* Response Parameters Section */}
        <div className="response-parameters">
          <h2>Response Parameters</h2>

          <label className="label">Expected Status Code:</label>
          <Select
            className="custom-dropdown"
            options={statusCodes}
            defaultValue={statusCodes.find((option) => option.value === "200")}
            onChange={handleStatusChange}
            isClearable
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: "#4a5568",
                borderColor: "#63b3ed",
                color: "#f7fafc",
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: "#2d3748",
              }),
              option: (provided, state) => ({
                ...provided,
                color: state.isSelected ? "#f7fafc" : "#f7fafc",
                backgroundColor: state.isSelected
                  ? "#4a5568"
                  : state.isFocused
                  ? "#63b3ed"
                  : "#4a5568",
                "&:hover": {
                  backgroundColor: "#63b3ed",
                },
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "#f7fafc",
              }),
              placeholder: (provided) => ({
                ...provided,
                color: "#a0aec0",
              }),
              input: (provided) => ({
                ...provided,
                color: "#f7fafc",
              }),
            }}
          />
        </div>

        <button className="generate-button" onClick={handleGenerateCode}>
          Generate Code
        </button>
      </div>

      <div className="right-pane">
        <h2 className="subtitle">Generated Code</h2>
        <div className="code-block" ref={codeBlockRef}>
          {/* Generated REST Assured code will be displayed here */}
        </div>
        <button className="copy-button" onClick={handleCopyCode}>
          Copy Code
        </button>
        {copyMessage && <div className="copy-message">{copyMessage}</div>}
        <p className="repo-instructions">
          To use the generated API test code, clone
          <a href="https://github.com/osandadeshan/rest-assured-codegen-test-project">
            this GitHub repository
          </a>
          and place the generated tests in the <code>/src/test/java</code>{" "}
          directory.
        </p>
      </div>
    </div>
  );
}
