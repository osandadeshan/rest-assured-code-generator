"use client";

import { useRef, useState } from "react";
import "./styles.css"; // Importing the external CSS file

export default function Home() {
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [queryParams, setQueryParams] = useState([{ key: "", value: "" }]);
  const [pathParams, setPathParams] = useState([{ key: "", value: "" }]);
  const [formData, setFormData] = useState([{ key: "", value: "" }]);
  const [requestBodyType, setRequestBodyType] = useState("JSON");
  const [jsonBody, setJsonBody] = useState("");
  const [httpMethod, setHttpMethod] = useState("GET");
  const [expectedStatusCode, setExpectedStatusCode] = useState("");
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

  const handleGenerateCode = () => {
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
      .join("\n                ");

    // Query Parameters
    const queryParamStrings = queryParams
      .filter((param) => param.key && param.value)
      .map((param) => `.addQueryParam("${param.key}", "${param.value}")`)
      .join("\n                ");

    // Headers
    const headerStrings = headers
      .filter((header) => header.key && header.value)
      .map((header) => `.addHeader("${header.key}", "${header.value}")`)
      .join("\n                ");

    // Request Body for JSON
    const bodyContent = jsonBody
      .replace(/\\/g, "\\\\") // Escape backslashes
      .replace(/"/g, '\\"') // Escape quotes
      .replace(/\n/g, "\\n"); // Replace new lines with \n

    const formattedBody = `"${bodyContent}"`;

    // Generate the full Java class with imports
    let restAssuredCode = `
    import io.restassured.RestAssured;
    import io.restassured.builder.RequestSpecBuilder;
    import io.restassured.http.ContentType;
    import org.testng.annotations.Test;
    
    public class ApiTest {
        @Test
        public void testApi() {
            RequestSpecBuilder requestSpecBuilder = new RequestSpecBuilder()
                    .setBaseUri("${baseUrl}") // Set API base url
                    .setBasePath("${apiEndpoint}${
      pathParamPlaceholders ? "/" + pathParamPlaceholders : ""
    }") // Set endpoint with path parameters
                    ${
                      pathParamStrings
                        ? "\n                " + pathParamStrings
                        : ""
                    }
                    ${
                      queryParamStrings
                        ? "\n                " + queryParamStrings
                        : ""
                    }
                    ${headerStrings ? "\n                " + headerStrings : ""}
                    .setContentType(ContentType.${
                      requestBodyType === "JSON" ? "JSON" : "MULTIPART"
                    }) // Set content type
                    .setAccept(ContentType.ANY)
                    ${
                      requestBodyType === "JSON"
                        ? `
                    .setBody(${formattedBody}) // Pass JSON body as a string
                    `
                        : `
                    ${formData
                      .map(
                        (param) => `
                    .addMultiPart("${param.key}", "${param.value}")`
                      )
                      .join("")}`
                    };
        
            RestAssured
                    .given(requestSpecBuilder.build()).log().all()
                    .when()
                    .${httpMethod.toLowerCase()}()
                    .then().log().all()
                    .statusCode(${
                      expectedStatusCode || 200
                    }); // Validate expected status code
        }
    }
    `;

    // Display the generated code
    codeBlock.innerHTML = restAssuredCode; // Use innerHTML to allow HTML tags
  };

  const handleCopyCode = () => {
    if (codeBlockRef.current) {
      const code = codeBlockRef.current.innerText;
      navigator.clipboard
        .writeText(code)
        .then(() => {
          setCopyMessage("Code copied to clipboard!");
          setTimeout(() => setCopyMessage(""), 3000); // Clear message after 3 seconds
        })
        .catch((err) => {
          console.error("Could not copy text: ", err);
        });
    }
  };

  return (
    <div className="container">
      <div className="left-pane">
        <h1 className="title">RestAssured Code Generator</h1>

        <label className="label">Base URL</label>
        <input type="text" className="input" placeholder="Base URL" />

        <label className="label">API Endpoint</label>
        <input type="text" className="input" placeholder="API Endpoint" />

        <label className="label">HTTP Method</label>
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

        <label className="label">Expected Status Code</label>
        <input
          type="text"
          className="input"
          placeholder="Expected Status Code"
          value={expectedStatusCode}
          onChange={(e) => setExpectedStatusCode(e.target.value)}
        />

        <label className="label">Query Parameters</label>
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

        <label className="label">Path Parameters</label>
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
              placeholder="Path Parameter Key"
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
              placeholder="Path Parameter Value"
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

        <label className="label">Headers</label>
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

        <label className="label">Request Body Type</label>
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
            <label className="label">JSON Body</label>
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
            <label className="label">Form Data</label>
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

        <button className="generate-button" onClick={handleGenerateCode}>
          Generate Code
        </button>
      </div>

      <div className="right-pane">
        <h2 className="subtitle">Generated Code</h2>
        <div className="code-block" ref={codeBlockRef}>
          {/* Generated RestAssured code will be displayed here */}
        </div>
        <button className="copy-button" onClick={handleCopyCode}>
          Copy Code
        </button>
        {copyMessage && <div className="copy-message">{copyMessage}</div>}
      </div>
    </div>
  );
}
