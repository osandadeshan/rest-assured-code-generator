"use client";

import { useState } from "react";
import "./styles.css"; // Importing the external CSS file

export default function Home() {
    const [queryParams, setQueryParams] = useState([{ key: "", value: "" }]);
    const [pathParams, setPathParams] = useState([{ key: "", value: "" }]);
    const [formData, setFormData] = useState([{ key: "", value: "" }]);
    const [requestBodyType, setRequestBodyType] = useState("JSON");
    const [jsonBody, setJsonBody] = useState("");
    const [httpMethod, setHttpMethod] = useState("GET");
    const [expectedStatusCode, setExpectedStatusCode] = useState("");

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
      const baseUrlInput = document.querySelector('input[placeholder="Base URL"]') as HTMLInputElement | null;
      const apiEndpointInput = document.querySelector('input[placeholder="API Endpoint"]') as HTMLInputElement | null;
      const codeBlock = document.querySelector('.code-block');
  
      if (!baseUrlInput || !apiEndpointInput || !codeBlock) {
          console.error("One or more elements are missing.");
          return;
      }
  
      const baseUrl = baseUrlInput.value.trim();
      const apiEndpoint = apiEndpointInput.value.trim();
  
      // Construct URL with placeholders for path parameters
      const pathParamPlaceholders = pathParams
          .filter(param => param.key) // Ensure only keys are included
          .map(param => `{${param.key}}`)
          .join('/'); // Join them with a slash
  
      const fullUrl = pathParamPlaceholders
          ? `${baseUrl}${apiEndpoint}/${pathParamPlaceholders}`
          : `${baseUrl}${apiEndpoint}`;
  
      // Handle query parameters
      const queryStrings = queryParams
          .filter(param => param.key && param.value)
          .map(param => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
          .join('&');
  
      const completeUrl = queryStrings ? `${fullUrl}?${queryStrings}` : fullUrl;
  
      // Generate path param strings for RestAssured
      const pathParamStrings = pathParams
          .filter(param => param.key)
          .map(param => `pathParam("${param.key}", "${param.value}")`)
          .join('\n            ');
  
      // Generate the full Java class with imports
      let restAssuredCode = `
  <span class="keyword">import</span> static io.restassured.RestAssured.*;
  <span class="keyword">import</span> static org.hamcrest.Matchers.*;
  
  <span class="keyword">public</span> <span class="keyword">class</span> ApiTest {
      <span class="keyword">public</span> <span class="keyword">void</span> testApi() {
          <span class="keyword">String</span> url = "<span class="string">${completeUrl}</span>";
  
          <span class="keyword">given</span>()
              ${pathParamStrings}
              <span class="keyword">.body</span>(<span class="string">${requestBodyType === "JSON" ? jsonBody : ''}</span>)
              <span class="keyword">.when</span>()
              <span class="keyword">.${httpMethod.toLowerCase()}</span>(url)
              <span class="keyword">.then</span>()
              <span class="keyword">.statusCode</span>(${expectedStatusCode || 200}); <span class="comment">// Validate expected status code</span>
      }
  }
  `;
  
      // Display the generated code
      codeBlock.innerHTML = restAssuredCode; // Use innerHTML to allow HTML tags
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
                <div className="code-block">
                    {/* Generated RestAssured code will be displayed here */}
                </div>
                <button className="copy-button">Copy Code</button>
            </div>
        </div>
    );
}
